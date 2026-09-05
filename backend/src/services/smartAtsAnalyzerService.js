const { ATS_SCORING_WEIGHTS, ATS_SCORE_DISCLAIMER } = require('../config/atsScoringConfig');
const { generateAiRecommendations } = require('./aiService');

/**
 * Calculates the Estimated ATS Compatibility Score (0-100)
 * Evaluates across 6 configurable dimensions:
 * Formatting (20), Keywords (25), Skills (20), Experience (15), Education (10), Content (10)
 *
 * @param {Object} resumeData
 * @param {string} [jobDescription]
 * @param {Object} [customWeights]
 * @returns {Promise<Object>}
 */
const analyzeResumeAts = async (resumeData = {}, jobDescription = '', customWeights = {}) => {
  const weights = { ...ATS_SCORING_WEIGHTS, ...customWeights };

  const personal = resumeData.personal || {};
  const summary = resumeData.summary || '';
  const education = resumeData.education || [];
  const technicalSkills = resumeData.technicalSkills || [];
  const experience = resumeData.experience || [];
  const projects = resumeData.projects || [];
  const certifications = resumeData.certifications || [];
  const referees = resumeData.referees || [];

  const strengths = [];
  const issues = [];

  // 1. FORMATTING & STRUCTURE (Weight: 20)
  let formattingPct = 70;
  if (personal.fullName && personal.email && personal.phone) {
    formattingPct += 15;
  } else {
    issues.push('Personal contact information is incomplete (ensure name, email, and phone are provided).');
  }

  // Check section coverage
  const sectionsPresent = [
    summary.trim().length > 0,
    education.length > 0,
    technicalSkills.length > 0,
    experience.length > 0,
    projects.length > 0,
  ].filter(Boolean).length;

  if (sectionsPresent >= 4) {
    formattingPct += 15;
    strengths.push('Clear formatting and standardized ATS section hierarchy');
  } else {
    formattingPct -= 10;
    issues.push('Resume is missing critical sections (ensure summary, education, skills, experience, and projects are present).');
  }
  formattingPct = Math.min(100, Math.max(0, formattingPct));
  const formattingScore = parseFloat(((formattingPct / 100) * weights.formatting).toFixed(1));

  // 2. SKILLS (Weight: 20)
  let skillsPct = 50;
  const allSkillsText = Array.isArray(technicalSkills)
    ? technicalSkills.map((t) => t.skills || '').join(', ')
    : '';
  const skillsCount = allSkillsText.split(/[,|•\n]/).filter((s) => s.trim().length > 0).length;

  if (skillsCount >= 8) {
    skillsPct += 35;
    strengths.push('Strong technical skills inventory with multi-category coverage');
  } else if (skillsCount >= 4) {
    skillsPct += 20;
  } else {
    issues.push('Technical skills list is sparse; consider organizing skills into focused categories.');
  }

  if (technicalSkills.length >= 3) {
    skillsPct += 15;
  }
  skillsPct = Math.min(100, Math.max(0, skillsPct));
  const skillsScore = parseFloat(((skillsPct / 100) * weights.skills).toFixed(1));

  // 3. EXPERIENCE (Weight: 15)
  let experiencePct = 40;
  if (experience.length > 0) {
    experiencePct += 30;
    strengths.push('Good experience section with descriptive role timelines');
    const totalBullets = experience.reduce((acc, cur) => acc + (cur.bulletPoints?.length || 0), 0);
    if (totalBullets >= 4) {
      experiencePct += 15;
    }
    const hasMetrics = experience.some((e) =>
      (e.bulletPoints || []).some((b) => /\b\d+%|\$\d+|\b\d+\s*(ms|s|x|users|clients)\b/i.test(b))
    );
    if (hasMetrics) {
      experiencePct += 15;
      strengths.push('Measurable quantitative metrics identified in employment history');
    } else {
      issues.push('Bullet points lack measurable metrics or quantitative impact.');
    }
  } else {
    issues.push('No professional experience listed; consider adding relevant work, internships, or freelance roles.');
  }
  experiencePct = Math.min(100, Math.max(0, experiencePct));
  const experienceScore = parseFloat(((experiencePct / 100) * weights.experience).toFixed(1));

  // 4. EDUCATION (Weight: 10)
  let educationPct = 50;
  if (education.length > 0) {
    educationPct += 35;
    if (education.some((ed) => ed.degree && ed.institution)) {
      educationPct += 15;
      strengths.push('Accredited educational degrees with institution and graduation timeline');
    }
  } else {
    issues.push('Education details are omitted.');
  }
  educationPct = Math.min(100, Math.max(0, educationPct));
  const educationScore = parseFloat(((educationPct / 100) * weights.education).toFixed(1));

  // 5. CONTENT & SUMMARY (Weight: 10)
  let contentPct = 50;
  if (summary.trim().length >= 80) {
    contentPct += 35;
    strengths.push('Compelling professional summary statement');
  } else if (summary.trim().length > 0) {
    contentPct += 15;
    issues.push('Summary could be stronger; expand to 2-3 sentences outlining your specialty.');
  } else {
    issues.push('Professional summary is missing.');
  }
  if (projects.length >= 2) {
    contentPct += 15;
  }
  contentPct = Math.min(100, Math.max(0, contentPct));
  const contentScore = parseFloat(((contentPct / 100) * weights.content).toFixed(1));

  // 6. KEYWORDS (Weight: 25)
  let keywordsPct = 65;
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  let matchedKeywords = [];
  let missingKeywords = [];

  const candidateKeywords = [
    'react', 'node.js', 'typescript', 'javascript', 'python', 'docker', 'kubernetes',
    'aws', 'gcp', 'azure', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest api',
    'microservices', 'ci/cd', 'git', 'linux', 'tailwind', 'next.js', 'sql', 'agile'
  ];

  if (jobDescription && jobDescription.trim().length > 0) {
    const jdLower = jobDescription.toLowerCase();
    candidateKeywords.forEach((kw) => {
      if (jdLower.includes(kw)) {
        if (resumeText.includes(kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      }
    });

    const totalKeywordsFound = matchedKeywords.length + missingKeywords.length;
    if (totalKeywordsFound > 0) {
      keywordsPct = Math.round((matchedKeywords.length / totalKeywordsFound) * 100);
    }
  } else {
    matchedKeywords = candidateKeywords.filter((kw) => resumeText.includes(kw));
    missingKeywords = candidateKeywords.filter((kw) => !resumeText.includes(kw)).slice(0, 5);
    keywordsPct = Math.min(100, Math.max(50, matchedKeywords.length * 8));
  }

  if (matchedKeywords.length >= 6) {
    strengths.push(`Strong keyword alignment with ${matchedKeywords.length} verified technical keywords`);
  }
  if (missingKeywords.length > 0) {
    issues.push(`Missing keywords: ${missingKeywords.slice(0, 4).join(', ')}`);
  }

  keywordsPct = Math.min(100, Math.max(0, keywordsPct));
  const keywordsScore = parseFloat(((keywordsPct / 100) * weights.keywords).toFixed(1));

  // Total Estimated ATS Compatibility Score
  const totalScore = Math.min(
    100,
    Math.max(0, Math.round(formattingScore + skillsScore + experienceScore + educationScore + contentScore + keywordsScore))
  );

  // Generate actionable AI recommendations based strictly on user data
  const aiRecs = await generateAiRecommendations(
    resumeData,
    { totalScore, formattingScore, skillsScore, experienceScore, educationScore, contentScore, keywordsScore },
    jobDescription
  );

  const finalRecommendations = [
    ...(aiRecs.summarySuggestions || []),
    ...(aiRecs.keywordSuggestions || []),
    ...(aiRecs.experienceSuggestions || []),
    ...(aiRecs.skillSuggestions || []),
    ...(aiRecs.formattingSuggestions || []),
  ].slice(0, 6);

  return {
    score: totalScore,
    disclaimer: ATS_SCORE_DISCLAIMER,
    categories: {
      formatting: { score: formattingScore, maxScore: weights.formatting, percentage: formattingPct },
      keywords: { score: keywordsScore, maxScore: weights.keywords, percentage: keywordsPct },
      skills: { score: skillsScore, maxScore: weights.skills, percentage: skillsPct },
      experience: { score: experienceScore, maxScore: weights.experience, percentage: experiencePct },
      education: { score: educationScore, maxScore: weights.education, percentage: educationPct },
      content: { score: contentScore, maxScore: weights.content, percentage: contentPct },
    },
    strengths: strengths.slice(0, 5),
    issues: issues.slice(0, 5),
    recommendations: finalRecommendations,
    matchedKeywords,
    missingKeywords,
    createdAt: new Date(),
  };
};

module.exports = {
  analyzeResumeAts,
};
