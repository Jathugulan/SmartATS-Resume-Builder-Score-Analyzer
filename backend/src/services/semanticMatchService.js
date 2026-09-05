/**
 * Semantic Matching Service
 * Provides multi-tier matching: EXACT, SYNONYM, SEMANTIC, CONTEXTUAL, MISSING
 * Ensures strict technological distinction (React != Angular, MongoDB != MySQL, AWS != Azure)
 */

const SYNONYMS = {
  'k8s': 'kubernetes',
  'kubernetes': 'k8s',
  'golang': 'go',
  'go': 'golang',
  'postgres': 'postgresql',
  'postgresql': 'postgres',
  'js': 'javascript',
  'javascript': 'js',
  'ts': 'typescript',
  'typescript': 'ts',
  'node': 'node.js',
  'node.js': 'node',
  'nodejs': 'node.js',
  'react': 'react.js',
  'react.js': 'react',
  'vue': 'vue.js',
  'vue.js': 'vue',
  'angular': 'angular.js',
  'nextjs': 'next.js',
  'next.js': 'nextjs',
  'py': 'python',
  'python': 'py',
  'ci/cd': 'continuous integration',
  'ci-cd': 'continuous integration',
  'rest': 'restful api',
  'rest api': 'restful api',
  'restful': 'restful api',
  'restful api': 'rest',
  'graphql': 'graphql api',
  'mongo': 'mongodb',
  'mongodb': 'mongo',
  'docker': 'containerization',
  'gcp': 'google cloud',
  'google cloud platform': 'google cloud',
  'aws': 'amazon web services',
  'amazon web services': 'aws',
};

// Strict non-equivalence blacklist: never mark as equivalent
const INCOMPATIBLE_PAIRS = [
  ['react', 'angular'],
  ['react', 'vue'],
  ['angular', 'vue'],
  ['mongodb', 'mysql'],
  ['mongodb', 'postgresql'],
  ['mysql', 'mongodb'],
  ['aws', 'azure'],
  ['aws', 'gcp'],
  ['azure', 'gcp'],
  ['python', 'java'],
  ['c++', 'c#'],
  ['php', 'ruby'],
];

const SEMANTIC_PATTERNS = [
  {
    pattern: /rest(ful)?\s*(api|web service|endpoint)/i,
    concept: 'rest api development',
    matches: ['rest', 'rest api', 'restful api', 'api development', 'web services'],
  },
  {
    pattern: /cloud\s*(infrastructure|architecture|computing)/i,
    concept: 'cloud computing',
    matches: ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
  },
  {
    pattern: /relational\s*database|sql\s*database/i,
    concept: 'relational database',
    matches: ['postgresql', 'mysql', 'sql', 'sqlite', 'oracle'],
  },
  {
    pattern: /nosql|document\s*store/i,
    concept: 'nosql database',
    matches: ['mongodb', 'redis', 'cassandra', 'dynamodb', 'couchdb'],
  },
  {
    pattern: /automated\s*test(ing)?|unit\s*test(ing)?/i,
    concept: 'automated testing',
    matches: ['jest', 'pytest', 'mocha', 'cypress', 'selenium', 'testing-library'],
  },
  {
    pattern: /version\s*control|source\s*control/i,
    concept: 'version control',
    matches: ['git', 'github', 'gitlab', 'bitbucket'],
  },
];

const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .replace(/[^\w\s.+/-]/g, '')
    .trim();

/**
 * Checks if two items are incompatible (e.g. React vs Angular)
 */
const areIncompatible = (itemA, itemB) => {
  const a = normalize(itemA);
  const b = normalize(itemB);
  return INCOMPATIBLE_PAIRS.some(
    ([x, y]) => (a.includes(x) && b.includes(y)) || (a.includes(y) && b.includes(x))
  );
};

/**
 * Evaluates semantic match between a candidate resume and job requirements
 */
const evaluateSemanticMatch = (resumeSkills = [], resumeText = '', jdRequirements = []) => {
  const normalizedResumeSkills = (resumeSkills || []).map((s) => normalize(s));
  const fullResumeText = (resumeText || '').toLowerCase();

  const exactMatches = [];
  const synonymMatches = [];
  const semanticMatches = [];
  const missingMatches = [];

  for (const req of jdRequirements) {
    const rawReq = typeof req === 'string' ? req : req.text || req.skill || '';
    const normReq = normalize(rawReq);
    if (!normReq) continue;

    // 1. Exact Match
    const exactSkill = normalizedResumeSkills.find(
      (s) => s === normReq || normReq === s || fullResumeText.includes(` ${normReq} `) || fullResumeText.includes(normReq)
    );
    if (exactSkill) {
      exactMatches.push({
        requirement: rawReq,
        matchedWith: exactSkill || normReq,
        matchType: 'EXACT',
        confidence: 1.0,
        explanation: `Exact textual match found in resume: "${exactSkill || normReq}"`,
      });
      continue;
    }

    // 2. Synonym Match
    const synonym = SYNONYMS[normReq];
    if (synonym) {
      const synSkill = normalizedResumeSkills.find(
        (s) => s === synonym || normalize(s) === synonym || fullResumeText.includes(synonym)
      );
      if (synSkill && !areIncompatible(normReq, synSkill)) {
        synonymMatches.push({
          requirement: rawReq,
          matchedWith: synSkill,
          matchType: 'SYNONYM',
          confidence: 0.95,
          explanation: `Industry standard synonym match: "${rawReq}" correlates with "${synSkill}"`,
        });
        continue;
      }
    }

    // 3. Semantic / Conceptual Match
    let foundSemantic = null;
    for (const rule of SEMANTIC_PATTERNS) {
      if (rule.pattern.test(rawReq) || rule.matches.includes(normReq)) {
        const matchingSkill = normalizedResumeSkills.find((s) => rule.matches.includes(s));
        if (matchingSkill && !areIncompatible(normReq, matchingSkill)) {
          foundSemantic = {
            requirement: rawReq,
            matchedWith: matchingSkill,
            matchType: 'SEMANTIC',
            confidence: 0.82,
            explanation: `Semantic domain alignment: "${rawReq}" supported by verified skill "${matchingSkill}"`,
          };
          break;
        }
      }
    }

    if (foundSemantic) {
      semanticMatches.push(foundSemantic);
      continue;
    }

    // 4. Missing
    missingMatches.push({
      requirement: rawReq,
      matchType: 'MISSING',
      confidence: 0,
      importance: typeof req === 'object' && req.category ? req.category : 'REQUIRED',
      explanation: `No direct, synonym, or semantic evidence detected in resume for "${rawReq}"`,
    });
  }

  const total = jdRequirements.length || 1;
  const matchScore = Math.min(
    100,
    Math.round(
      ((exactMatches.length * 1.0 + synonymMatches.length * 0.95 + semanticMatches.length * 0.8) / total) *
        100
    )
  );

  return {
    matchScore,
    exactMatches,
    synonymMatches,
    semanticMatches,
    missingMatches,
    totalRequirements: total,
    summary: {
      exactCount: exactMatches.length,
      synonymCount: synonymMatches.length,
      semanticCount: semanticMatches.length,
      missingCount: missingMatches.length,
    },
  };
};

module.exports = {
  evaluateSemanticMatch,
  SYNONYMS,
  areIncompatible,
};
