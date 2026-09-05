const { callOpenAI } = require('../services/aiService');
const { aiAnalysisResponseSchema } = require('../validators/analysisSchema');

const SYSTEM_INSTRUCTION = `You are a Senior ATS Resume Architect, Executive Recruiter, and HR Technology Auditor.
Your task is to analyze candidate resumes against modern Applicant Tracking Systems (ATS) and optional Job Descriptions with absolute factual precision.

CRITICAL ANTI-FABRICATION AND EVIDENCE RULES:
1. Analyze ONLY the provided resume text and optional Job Description.
2. NEVER invent, infer, or hallucinate candidate information, companies, job titles, employment dates, skills, education, certifications, projects, achievements, or metrics.
3. If an item is not explicitly present in the source text:
   - For string fields, return null.
   - For array fields, return [].
   - Never output placeholder strings like "N/A", "Unknown", or fake dummy values.
4. When a Job Description IS provided:
   - Perform strict, evidence-based matching of JD requirements against resume evidence.
   - Categorize skills as matched, missing, or partial (with exact context).
5. When a Job Description is NOT provided:
   - Mark matching arrays (matchedSkills, missingSkills, etc.) as empty arrays [].
   - Evaluate general ATS structural health, skill depth, and profile consistency.
6. Evaluate rawScores (0 to 100) for all seven ATS categories:
   - keywordSkillMatch (30% weight)
   - jobDescriptionRelevance (25% weight)
   - atsStructure (15% weight)
   - relevantExperience (15% weight)
   - educationCertifications (5% weight)
   - achievementsImpact (5% weight)
   - formattingReadability (5% weight)
7. For every scoring category, provide real evidence bullets citing exact excerpts or specific structural observations from the document, along with a thorough explanation.
8. Output ONLY a valid JSON object matching the requested schema. No conversational preamble or trailing remarks.`;

const buildUserPrompt = (resumeText, jobDescription) => {
  const jdSection = jobDescription
    ? `TARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""`
    : `TARGET JOB DESCRIPTION:\n(None provided. Perform standalone ATS quality and structural analysis).`;

  return `Please perform a comprehensive ATS analysis on the following candidate resume:

${jdSection}

CANDIDATE RESUME TEXT:
"""
${resumeText}
"""

Ensure the JSON matches this structure:
{
  "candidate": {
    "fullName": string or null,
    "email": string or null,
    "phone": string or null,
    "location": string or null,
    "linkedIn": string or null,
    "gitHub": string or null,
    "portfolio": string or null,
    "professionalTitle": string or null,
    "summary": string or null
  },
  "sectionsDetected": [
    { "name": string, "present": boolean, "quality": string }
  ],
  "skills": {
    "technical": [string],
    "tools": [string],
    "soft": [string],
    "domain": [string]
  },
  "experience": [
    {
      "jobTitle": string or null,
      "company": string or null,
      "period": string or null,
      "responsibilities": [string],
      "technologies": [string],
      "quantifiedImpact": [string]
    }
  ],
  "education": [
    {
      "institution": string or null,
      "degree": string or null,
      "field": string or null,
      "graduationYear": string or null,
      "gpa": string or null
    }
  ],
  "certifications": [
    {
      "name": string or null,
      "issuingOrganization": string or null,
      "date": string or null,
      "credentialId": string or null
    }
  ],
  "projects": [
    {
      "title": string or null,
      "description": string or null,
      "technologies": [string],
      "link": string or null
    }
  ],
  "achievements": [string],
  "jobDescriptionAnalysis": {
    "targetRole": string or null,
    "requiredSkills": [string],
    "preferredSkills": [string],
    "responsibilities": [string],
    "qualifications": [string],
    "keywords": [string]
  },
  "matching": {
    "matchedSkills": [string],
    "missingSkills": [string],
    "partialSkills": [{ "skill": string, "context": string }],
    "matchedKeywords": [string],
    "missingKeywords": [string]
  },
  "atsRisks": [
    { "severity": "high" | "medium" | "low", "category": string, "issue": string, "remediation": string }
  ],
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [
    { "priority": "high" | "medium" | "low", "category": string, "recommendation": string, "evidence": string }
  ],
  "rawScores": {
    "keywordSkillMatch": number,
    "jobDescriptionRelevance": number,
    "atsStructure": number,
    "relevantExperience": number,
    "educationCertifications": number,
    "achievementsImpact": number,
    "formattingReadability": number
  },
  "scoreEvidence": {
    "keywordSkillMatch": { "evidence": [string], "explanation": string },
    "jobDescriptionRelevance": { "evidence": [string], "explanation": string },
    "atsStructure": { "evidence": [string], "explanation": string },
    "relevantExperience": { "evidence": [string], "explanation": string },
    "educationCertifications": { "evidence": [string], "explanation": string },
    "achievementsImpact": { "evidence": [string], "explanation": string },
    "formattingReadability": { "evidence": [string], "explanation": string }
  },
  "finalVerdict": string
}`;
};

// ---------------------------------------------------------------------------
// Rule-based fallback analyser
// Used when the AI provider is unavailable (rate-limited / quota exceeded).
// Produces a best-effort structural analysis from the raw resume text alone.
// ---------------------------------------------------------------------------
const TECH_SKILLS_RE = /\b(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r\b|matlab|html|css|sql|bash|shell|react|angular|vue|next\.?js|nuxt|svelte|node\.?js|express|django|flask|fastapi|spring|rails|laravel|gin|graphql|rest|grpc|aws|azure|gcp|docker|kubernetes|k8s|terraform|ansible|jenkins|github actions|ci\/cd|postgresql|mysql|mongodb|redis|elasticsearch|kafka|rabbitmq|pandas|numpy|scikit-learn|tensorflow|pytorch|langchain|openai|git|linux|nginx|jest|pytest|cypress|selenium)\b/gi;
const SOFT_SKILLS_RE = /\b(leadership|communication|teamwork|collaboration|problem.solving|critical thinking|adaptability|time management|project management|mentoring|analytical|creativity|decision.making)\b/gi;
const SECTION_KEYWORDS = {
  summary: /\b(summary|objective|profile|about me|professional summary)\b/i,
  experience: /\b(experience|work history|employment|career)\b/i,
  education: /\b(education|academic|degree|university|college|school)\b/i,
  skills: /\b(skills|competencies|technologies|technical skills|expertise)\b/i,
  projects: /\b(projects|portfolio|open.source|side.projects)\b/i,
  certifications: /\b(certifications?|licenses?|credentials?|awards?)\b/i,
  achievements: /\b(achievements?|accomplishments?|highlights?)\b/i,
};
const QUANT_RE = /\b(\d+[\+%]?\s*(years?|months?|users?|clients?|ms|seconds?|x|times?|\$[\d,]+|[\d,]+\s*(records?|requests?|transactions?|engineers?|members?|people)))\b/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s\-().]{8,}\d)/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /github\.com\/[\w-]+/i;

const SECTION_BLACKLIST = new Set([
  'summary',
  'professional summary',
  'executive summary',
  'profile',
  'about me',
  'objective',
  'resume',
  'curriculum vitae',
  'cv',
  'contact',
  'contact info',
  'contact information',
  'education',
  'experience',
  'work experience',
  'skills',
  'technical skills',
  'projects',
  'certifications',
  'achievements',
  'personal details',
]);

/**
 * Extracts a candidate name heuristic:
 * Handles ALL-CAPS names, Title Case, initials, pipes/separators, and filters section titles.
 */
const extractName = (text, userContext = null) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 12)) {
    const cleaned = line.split(/[|•·\/\\]/)[0].trim();
    if (!cleaned || cleaned.length < 3 || cleaned.length > 50) continue;
    if (SECTION_BLACKLIST.has(cleaned.toLowerCase())) continue;
    if (/[\d@:;{}()<>+=]/.test(cleaned)) continue;

    // Check ALL-CAPS: e.g. "RAVEENDRAN JATHUGULAN"
    if (/^[A-Z]{2,}(?:\s+[A-Z]{2,}){1,3}$/.test(cleaned)) {
      return cleaned
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    // Check Title Case: e.g. "Raveendran Jathugulan" or "R. Jathugulan"
    if (/^[A-Z][a-zA-Z.-]+(?:\s+[A-Z][a-zA-Z.-]+){1,3}$/.test(cleaned)) {
      return cleaned;
    }
  }

  // Fallback to user account name if provided
  if (userContext?.name && !SECTION_BLACKLIST.has(userContext.name.toLowerCase())) {
    return userContext.name;
  }

  return null;
};

const buildFallbackAnalysis = (resumeText, jobDescription, userContext = null) => {
  const text = resumeText || '';
  const lower = text.toLowerCase();

  // --- Candidate extraction ---
  const emailMatch = text.match(EMAIL_RE);
  const phoneMatch = text.match(PHONE_RE);
  const linkedInMatch = text.match(LINKEDIN_RE);
  const githubMatch = text.match(GITHUB_RE);

  // --- Sections ---
  const sectionsDetected = Object.entries(SECTION_KEYWORDS).map(([name, re]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    present: re.test(text),
    quality: re.test(text) ? 'Detected (rule-based scan)' : 'Not detected',
  }));
  const presentSections = sectionsDetected.filter((s) => s.present).length;

  // --- Skills ---
  const techMatches = [...new Set((text.match(TECH_SKILLS_RE) || []).map((s) => s.toLowerCase()))];
  const softMatches = [...new Set((text.match(SOFT_SKILLS_RE) || []).map((s) => s.toLowerCase()))];

  // --- Quantified impact ---
  const hasQuantMetrics = QUANT_RE.test(text);

  // --- Scoring heuristics (0-100) ---
  const keywordSkillMatch = Math.min(100, Math.max(40, 30 + techMatches.length * 4 + softMatches.length * 3));
  const jdRelevance = jobDescription ? 55 : Math.min(100, Math.round(50 + (presentSections / Object.keys(SECTION_KEYWORDS).length) * 40));
  const atsStructure = Math.min(100, Math.max(60, Math.round((presentSections / Object.keys(SECTION_KEYWORDS).length) * 100)));
  const expSection = SECTION_KEYWORDS.experience.test(text);
  const relevantExperience = expSection ? Math.min(100, 75 + (hasQuantMetrics ? 20 : 0)) : 35;
  const eduSection = SECTION_KEYWORDS.education.test(text);
  const certSection = SECTION_KEYWORDS.certifications.test(text);
  const educationScore = eduSection && certSection ? 90 : eduSection ? 80 : 35;
  const achievementsScore = hasQuantMetrics ? 75 : 50;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const formattingScore = wordCount >= 350 && wordCount <= 1000 ? 92 : wordCount >= 200 && wordCount <= 1300 ? 80 : 50;

  // --- Risks ---
  const atsRisks = [];
  if (!emailMatch) {
    atsRisks.push({ severity: 'high', category: 'Contact Info', issue: 'No email address detected', remediation: 'Add a professional email address at the top of your resume.' });
  }
  if (!SECTION_KEYWORDS.experience.test(text)) {
    atsRisks.push({ severity: 'high', category: 'Structure', issue: 'Work experience section not detected', remediation: 'Add a clearly labelled "Experience" or "Work History" section.' });
  }
  if (!hasQuantMetrics) {
    atsRisks.push({ severity: 'medium', category: 'Impact', issue: 'No quantified achievements found', remediation: 'Add measurable results (e.g., "Improved performance by 30%", "Managed a team of 5").' });
  }
  if (techMatches.length < 5) {
    atsRisks.push({ severity: 'medium', category: 'Keywords', issue: 'Relatively few technical keywords detected', remediation: 'Expand the skills section with specific tools, languages, and frameworks you have used.' });
  }
  if (wordCount < 200) {
    atsRisks.push({ severity: 'medium', category: 'Content', issue: 'Resume appears too short', remediation: 'Expand your experience descriptions with more detail about responsibilities and achievements.' });
  }

  // --- Strengths / weaknesses ---
  const strengths = [];
  const weaknesses = [];
  if (techMatches.length >= 8) strengths.push(`Strong technical keyword presence: ${techMatches.slice(0, 5).join(', ')} and more detected.`);
  if (linkedInMatch) strengths.push('LinkedIn profile URL included – improves recruiter reachability.');
  if (githubMatch) strengths.push('GitHub profile URL present – demonstrates portfolio depth.');
  if (hasQuantMetrics) strengths.push('Quantified impact metrics detected in experience descriptions.');
  if (presentSections >= 4) strengths.push('Good resume structure with multiple clearly defined sections.');
  if (techMatches.length < 5) weaknesses.push('Limited technical skill keywords may reduce ATS keyword match rate.');
  if (!hasQuantMetrics) weaknesses.push('Lack of measurable results weakens perceived impact.');
  if (!SECTION_KEYWORDS.summary.test(text)) weaknesses.push('No professional summary detected; adding one improves ATS parsing and recruiter impression.');
  if (!eduSection) weaknesses.push('Education section not detected or not clearly labelled.');

  // --- Recommendations ---
  const recommendations = [];
  if (!SECTION_KEYWORDS.summary.test(text)) {
    recommendations.push({ priority: 'high', category: 'Structure', recommendation: 'Add a concise Professional Summary (3-4 sentences) at the top of your resume.', evidence: 'Summary section not detected in the document.' });
  }
  if (!hasQuantMetrics) {
    recommendations.push({ priority: 'high', category: 'Impact', recommendation: 'Quantify your achievements with numbers, percentages, and timeframes.', evidence: 'No measurable metrics found in experience descriptions.' });
  }
  if (techMatches.length < 8) {
    recommendations.push({ priority: 'medium', category: 'Keywords', recommendation: 'Expand the skills section with industry-specific tools and technologies.', evidence: `Only ${techMatches.length} technical keyword(s) detected.` });
  }
  if (!linkedInMatch) {
    recommendations.push({ priority: 'medium', category: 'Contact', recommendation: 'Add your LinkedIn profile URL to improve recruiter engagement.', evidence: 'No LinkedIn URL found.' });
  }

  const scoreEvidence = {
    keywordSkillMatch: { evidence: techMatches.slice(0, 6).map((s) => `Detected: "${s}"`), explanation: `Found ${techMatches.length} unique technical keyword(s) in the document. Score is based on keyword density and breadth. (Rule-based fallback — AI was unavailable)` },
    jobDescriptionRelevance: { evidence: [], explanation: jobDescription ? 'Job description provided but AI matching was unavailable. Score reflects a neutral estimate.' : 'No Job Description provided. Score reflects general resume completeness. (Rule-based fallback)' },
    atsStructure: { evidence: sectionsDetected.filter((s) => s.present).map((s) => `Section detected: "${s.name}"`), explanation: `${presentSections} of ${Object.keys(SECTION_KEYWORDS).length} key sections detected. (Rule-based fallback)` },
    relevantExperience: { evidence: expSection ? ['Work experience section detected'] : ['Work experience section NOT detected'], explanation: `Experience section ${expSection ? 'found' : 'not found'}. Quantified metrics: ${hasQuantMetrics ? 'yes' : 'no'}. (Rule-based fallback)` },
    educationCertifications: { evidence: eduSection ? ['Education section detected'] : ['Education section NOT detected'], explanation: `Education section ${eduSection ? 'detected' : 'not found'}. (Rule-based fallback)` },
    achievementsImpact: { evidence: hasQuantMetrics ? ['Numeric/metric patterns found in text'] : ['No quantified metrics found'], explanation: `Quantified impact metrics ${hasQuantMetrics ? 'present' : 'absent'}. (Rule-based fallback)` },
    formattingReadability: { evidence: [`Word count: approximately ${wordCount}`], explanation: `Resume length is ${wordCount < 200 ? 'too short' : wordCount > 1200 ? 'potentially too long' : 'appropriate'}. (Rule-based fallback)` },
  };

  return {
    candidate: {
      fullName: extractName(text),
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      location: null,
      linkedIn: linkedInMatch ? linkedInMatch[0] : null,
      gitHub: githubMatch ? githubMatch[0] : null,
      portfolio: null,
      professionalTitle: null,
      summary: null,
    },
    sectionsDetected,
    skills: {
      technical: techMatches.slice(0, 20),
      tools: [],
      soft: softMatches.slice(0, 10),
      domain: [],
    },
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    achievements: [],
    jobDescriptionAnalysis: {
      targetRole: null,
      requiredSkills: [],
      preferredSkills: [],
      responsibilities: [],
      qualifications: [],
      keywords: [],
    },
    matching: {
      matchedSkills: [],
      missingSkills: [],
      partialSkills: [],
      matchedKeywords: [],
      missingKeywords: [],
    },
    atsRisks,
    strengths,
    weaknesses,
    recommendations,
    rawScores: {
      keywordSkillMatch: Math.round(keywordSkillMatch),
      jobDescriptionRelevance: Math.round(jdRelevance),
      atsStructure: Math.round(atsStructure),
      relevantExperience: Math.round(relevantExperience),
      educationCertifications: Math.round(educationScore),
      achievementsImpact: Math.round(achievementsScore),
      formattingReadability: Math.round(formattingScore),
    },
    scoreEvidence,
    finalVerdict: `⚠️ Note: This analysis was generated using a rule-based fallback engine because the AI provider (OpenAI) was temporarily unavailable due to rate limiting. The scores and insights are approximate. For a full AI-powered analysis, please try again in a few minutes.`,
  };
};

/**
 * Returns true when the error is a provider-side rate limit / quota exhaustion
 * that should trigger the rule-based fallback rather than a hard failure.
 */
const isRateLimitError = (err) =>
  err?.statusCode === 429 ||
  err?.code === 'AI_RATE_LIMIT' ||
  err?.response?.status === 429;

/**
 * Executes ATS Analysis with schema validation and 1-time retry on malformed outputs.
 * Falls back to rule-based analysis when AI is rate-limited.
 */
const analyzeResumeWithAI = async (resumeText, jobDescription = null, userContext = null) => {
  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    { role: 'user', content: buildUserPrompt(resumeText, jobDescription) },
  ];

  let rawJsonResult;
  try {
    rawJsonResult = await callOpenAI(messages);
  } catch (err) {
    if (isRateLimitError(err)) {
      console.warn('[ATSAgent] AI provider rate-limited after all retries. Switching to rule-based fallback analyser.');
      return buildFallbackAnalysis(resumeText, jobDescription, userContext);
    }
    throw err;
  }

  // First validation attempt
  const firstValidation = aiAnalysisResponseSchema.safeParse(rawJsonResult);
  if (firstValidation.success) {
    return firstValidation.data;
  }

  console.warn('[ATSAgent] First AI response failed schema validation. Attempting retry with error feedback...');
  const errorDetails = JSON.stringify(firstValidation.error.issues, null, 2);

  // Retry once with error feedback
  const retryMessages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    { role: 'user', content: buildUserPrompt(resumeText, jobDescription) },
    { role: 'assistant', content: JSON.stringify(rawJsonResult) },
    {
      role: 'user',
      content: `Your previous JSON output did not conform to the required schema:\n${errorDetails}\n\nPlease correct all issues and return the complete valid JSON object strictly matching the schema.`,
    },
  ];

  try {
    const retryJson = await callOpenAI(retryMessages);
    const secondValidation = aiAnalysisResponseSchema.safeParse(retryJson);
    if (secondValidation.success) {
      return secondValidation.data;
    }

    console.error('[ATSAgent] Second validation attempt failed:', secondValidation.error.issues);
    throw {
      statusCode: 500,
      code: 'AI_ANALYSIS_INVALID',
      message: 'The AI model generated an invalid or incomplete structured analysis response twice.',
      details: secondValidation.error.issues,
    };
  } catch (error) {
    if (isRateLimitError(error)) {
      console.warn('[ATSAgent] AI provider rate-limited during schema-fix retry. Switching to rule-based fallback analyser.');
      return buildFallbackAnalysis(resumeText, jobDescription, userContext);
    }
    if (error.statusCode) {
      throw error;
    }
    throw {
      statusCode: 500,
      code: 'AI_ANALYSIS_RETRY_FAILED',
      message: 'Failed to recover from invalid AI response.',
      details: error.message,
    };
  }
};

module.exports = {
  analyzeResumeWithAI,
};
