const axios = require('axios');
const env = require('../config/env');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const MAX_RETRIES = 3; // Up to 3 retries on transient 429s before surfacing the error

const getRetryDelay = (headers, attempt) => {
  // Respect the provider's Retry-After header when present
  const retryAfter = Number(headers?.['retry-after']);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(retryAfter * 1000, 30000); // Cap at 30 s
  }
  // Exponential back-off: 2 s, 4 s, 8 s …
  return Math.min(2000 * Math.pow(2, attempt), 30000);
};

/**
 * Sends a structured prompt to an OpenAI-compatible API endpoint.
 *
 * @param {Array} messages - Array of chat messages [{ role: 'system', content }, { role: 'user', content }]
 * @param {Object} options - Optional overrides (temperature, model, timeout)
 * @returns {Promise<Object>} Parsed JSON response from LLM
 */
const callOpenAI = async (messages, options = {}) => {
  if (!env.AI_API_KEY) {
    throw {
      statusCode: 500,
      code: 'AI_CONFIG_MISSING',
      message: 'AI_API_KEY is not configured on the server. Please set a valid API key in server/.env.',
    };
  }

  const endpoint = `${env.AI_BASE_URL}/chat/completions`;
  const timeoutMs = options.timeout || 60000;

  try {
    const payload = {
      model: options.model || env.AI_MODEL,
      messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.1,
      response_format: { type: 'json_object' },
    };

    let response;
    // Transient provider throttling (429) is common. Retry up to MAX_RETRIES
    // times with exponential back-off before surfacing the error to the client.
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        response = await axios.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.AI_API_KEY}`,
          },
          timeout: timeoutMs,
        });
        break; // Success – exit the retry loop
      } catch (requestError) {
        const is429 = requestError.response?.status === 429;
        const isLastAttempt = attempt === MAX_RETRIES - 1;
        if (!is429 || isLastAttempt) {
          throw requestError;
        }
        const delay = getRetryDelay(requestError.response.headers, attempt);
        console.warn(`[AI] Rate-limited by provider. Retrying in ${Math.round(delay / 1000)}s (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await sleep(delay);
      }
    }

    const choices = response.data && response.data.choices;
    if (!choices || choices.length === 0 || !choices[0].message) {
      throw new Error('AI API returned an empty or invalid response structure');
    }

    const content = choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Attempt to clean markdown code blocks if the model wrapped output in ```json ... ```
      const cleaned = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/i, '')
        .trim();
      return JSON.parse(cleaned);
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw {
        statusCode: 504,
        code: 'AI_TIMEOUT',
        message: 'The AI service timed out while analyzing the document. Please try again.',
      };
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const apiMsg = (data && data.error && data.error.message) || error.message;

      if (status === 401) {
        throw {
          statusCode: 500,
          code: 'AI_AUTH_ERROR',
          message: 'Authentication with AI provider failed. Check AI_API_KEY.',
          details: apiMsg,
        };
      }

      if (status === 429) {
        const retryAfter = data?.error?.retry_after || error.response.headers?.['retry-after'];
        throw {
          statusCode: 429,
          code: 'AI_RATE_LIMIT',
          message: 'The AI provider is temporarily busy. Please try again shortly.',
          details: apiMsg,
          retryAfter,
        };
      }

      throw {
        statusCode: 502,
        code: 'AI_PROVIDER_ERROR',
        message: `AI provider error (${status}): ${apiMsg}`,
        details: apiMsg,
      };
    }

    throw {
      statusCode: 500,
      code: 'AI_REQUEST_FAILED',
      message: error.message || 'Failed to communicate with AI service',
    };
  }
};

/**
 * Generates structured AI recommendations based strictly on user-provided information.
 * NEVER fabricates degrees, companies, jobs, skills, certifications, or achievements.
 *
 * @param {Object} resumeData
 * @param {Object} [analysis]
 * @param {string} [jobDescription]
 * @returns {Promise<Object>} { summarySuggestions, keywordSuggestions, experienceSuggestions, skillSuggestions, formattingSuggestions }
 */
const generateAiRecommendations = async (resumeData = {}, analysis = {}, jobDescription = '') => {
  // If OpenAI API key is configured, query LLM
  if (env.AI_API_KEY) {
    const systemPrompt = `You are the SmartATS AI Resume Intelligence Engine.
CRITICAL MANDATORY RULES:
1. NEVER fabricate, invent, or assume any jobs, degrees, companies, technical skills, certifications, or achievements not explicitly stated in the provided resume data.
2. Provide suggestions to rephrase, highlight impact, quantify results, and improve ATS keyword alignment strictly within the context of what the user provided.
3. If keywords are missing from a job description, suggest: "If you have experience with [X], consider describing that experience using relevant terminology." Never tell users to claim skills they do not possess.
4. Output MUST be valid JSON adhering strictly to this format:
{
  "summarySuggestions": ["string"],
  "keywordSuggestions": ["string"],
  "experienceSuggestions": ["string"],
  "skillSuggestions": ["string"],
  "formattingSuggestions": ["string"]
}`;

    const userPrompt = `Resume Data:
${JSON.stringify(resumeData, null, 2)}

Current Analysis:
${JSON.stringify(analysis, null, 2)}

Job Description (if provided):
${jobDescription || 'None provided'}

Generate actionable, ATS-compliant recommendations based strictly on this information.`;

    try {
      const result = await callOpenAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      return {
        summarySuggestions: Array.isArray(result.summarySuggestions) ? result.summarySuggestions : [],
        keywordSuggestions: Array.isArray(result.keywordSuggestions) ? result.keywordSuggestions : [],
        experienceSuggestions: Array.isArray(result.experienceSuggestions) ? result.experienceSuggestions : [],
        skillSuggestions: Array.isArray(result.skillSuggestions) ? result.skillSuggestions : [],
        formattingSuggestions: Array.isArray(result.formattingSuggestions) ? result.formattingSuggestions : [],
      };
    } catch (err) {
      console.warn('[AI] LLM call failed or bypassed, falling back to deterministic heuristic intelligence engine:', err.message);
    }
  }

  // Deterministic Heuristic Intelligence Engine (Zero Fabrication Guarantee)
  const summarySuggestions = [];
  const keywordSuggestions = [];
  const experienceSuggestions = [];
  const skillSuggestions = [];
  const formattingSuggestions = [];

  // Summary analysis
  const summary = resumeData.summary || '';
  if (!summary || summary.trim().length === 0) {
    summarySuggestions.push('Add a concise 2-3 sentence Professional Summary highlighting your core engineering disciplines and years of expertise.');
  } else {
    if (summary.length < 100) {
      summarySuggestions.push('Expand your summary to 2-4 sentences to better summarize your key qualifications and impact.');
    }
    if (!/\b(years|experience|developed|architected|specialized|track record)\b/i.test(summary)) {
      summarySuggestions.push('Begin your summary with your primary domain title and highlight the scale or environments you have operated in.');
    }
    if (/\b(responsible for|duties included)\b/i.test(summary)) {
      summarySuggestions.push('Replace passive phrases like "responsible for" with active executive verbs like "Led", "Engineered", or "Delivered".');
    }
  }

  // Technical Skills analysis
  const techSkills = resumeData.technicalSkills || [];
  const skillsList = Array.isArray(techSkills)
    ? techSkills.map((s) => s.skills || '').join(', ')
    : '';
  if (!techSkills || techSkills.length === 0 || skillsList.trim().length === 0) {
    skillSuggestions.push('Populate the Technical Skills section grouped into clear categories (e.g. Languages, Frameworks, Cloud, Databases).');
  } else {
    if (techSkills.length < 3) {
      skillSuggestions.push('Organize your existing skills into targeted categories to improve ATS machine parsability.');
    }
    skillSuggestions.push('Ensure each skill listed in this section is also evidenced within the context of your Experience or Projects.');
  }

  // Experience analysis
  const experience = resumeData.experience || [];
  if (!experience || experience.length === 0) {
    experienceSuggestions.push('Include relevant professional employment, internships, or freelance experience.');
  } else {
    experience.forEach((exp, idx) => {
      const bullets = exp.bulletPoints || [];
      const role = exp.role || exp.jobTitle || `Role #${idx + 1}`;
      if (bullets.length === 0) {
        experienceSuggestions.push(`Add 3 to 5 action-oriented bullet points under ${role} detailing your architectural contributions.`);
      } else {
        const hasMetrics = bullets.some((b) => /\b\d+%|\$\d+|\b\d+\s*(ms|s|x|users|clients|nodes|queries)\b/i.test(b));
        if (!hasMetrics) {
          experienceSuggestions.push(`Quantify the measurable impact under ${role} (e.g., latency reduction %, scale, or operational improvements achieved).`);
        }
        const hasActionVerb = bullets.some((b) => /^(Developed|Architected|Designed|Implemented|Spearheaded|Engineered|Reduced|Accelerated)/i.test(b.trim()));
        if (!hasActionVerb) {
          experienceSuggestions.push(`Begin bullet points under ${role} with strong past-tense action verbs.`);
        }
      }
    });
  }

  // Keywords & Job Description matching
  if (jobDescription && jobDescription.trim().length > 0) {
    const jdWords = jobDescription.toLowerCase().match(/\b[a-z0-9#+.-]{2,20}\b/g) || [];
    const stopWords = new Set(['the', 'and', 'with', 'for', 'that', 'this', 'from', 'have', 'will', 'you', 'our', 'are', 'your', 'about', 'skills', 'experience']);
    const candidateKeywords = [
      'react', 'node.js', 'typescript', 'javascript', 'python', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
      'postgresql', 'mongodb', 'redis', 'graphql', 'rest api', 'microservices', 'ci/cd', 'git', 'linux', 'tailwind',
      'next.js', 'sql', 'nosql', 'agile', 'scrum', 'system design', 'unit testing', 'terraform'
    ];

    const presentInJd = candidateKeywords.filter((kw) => jdWords.includes(kw.toLowerCase()) || jobDescription.toLowerCase().includes(kw));
    const resumeText = JSON.stringify(resumeData).toLowerCase();

    presentInJd.forEach((kw) => {
      if (!resumeText.includes(kw)) {
        keywordSuggestions.push(`If you have verified experience with "${kw}", consider explicitly incorporating relevant terminology into your projects or experience.`);
      }
    });
  } else {
    keywordSuggestions.push('Add industry-standard keywords related to your core engineering stack to maximize parsing match rates.');
    keywordSuggestions.push('Align technical nomenclature with standard industry terminology (e.g., "RESTful APIs", "CI/CD pipelines").');
  }

  // Formatting & Structure
  formattingSuggestions.push('Use standardized section headings in the mandatory order: Summary → Education → Skills → Experience → Projects → Certifications → Referees.');
  formattingSuggestions.push('Avoid non-standard glyphs, graphics, or nested tables that could disrupt legacy ATS parser AST tokenization.');
  formattingSuggestions.push('Verify date formats follow consistent standards (e.g., "MMM YYYY – MMM YYYY" or "YYYY – Present").');

  return {
    summarySuggestions,
    keywordSuggestions: keywordSuggestions.slice(0, 5),
    experienceSuggestions: experienceSuggestions.slice(0, 5),
    skillSuggestions: skillSuggestions.slice(0, 4),
    formattingSuggestions: formattingSuggestions.slice(0, 4),
  };
};

module.exports = {
  callOpenAI,
  generateAiRecommendations,
};
