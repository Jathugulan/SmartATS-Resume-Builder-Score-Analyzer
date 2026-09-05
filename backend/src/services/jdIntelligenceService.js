/**
 * Job Description Intelligence Engine
 * Parses raw job descriptions into structured requirements with importance scoring
 */

const ROLE_TITLES = [
  'full stack developer',
  'full stack engineer',
  'frontend developer',
  'frontend engineer',
  'backend developer',
  'backend engineer',
  'software engineer',
  'senior software engineer',
  'lead software engineer',
  'devops engineer',
  'cloud architect',
  'data engineer',
  'data scientist',
  'machine learning engineer',
  'mobile developer',
  'product manager',
  'ui/ux designer',
  'qa engineer',
];

const parseJobDescription = (text) => {
  const content = text || '';
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Detect target title
  let detectedTitle = 'Software Engineer';
  const lowerContent = content.toLowerCase();
  for (const role of ROLE_TITLES) {
    if (lowerContent.includes(role)) {
      detectedTitle = role.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // 2. Seniority detection
  let seniority = 'Mid-Level';
  if (/intern|apprentice/i.test(content)) seniority = 'Intern';
  else if (/junior|entry|associate|0-2\s*years/i.test(content)) seniority = 'Entry';
  else if (/senior|sr\.|5\+\s*years|6\+\s*years/i.test(content)) seniority = 'Senior';
  else if (/lead|principal|staff|architect/i.test(content)) seniority = 'Lead';
  else if (/director|vp|head of|executive/i.test(content)) seniority = 'Executive';

  // 3. Technical Skills Extraction
  const TECH_KEYWORDS = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'fastapi', 'spring',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'linux',
    'graphql', 'rest', 'restful api', 'microservices', 'tailwind css', 'html', 'css',
    'jest', 'pytest', 'cypress', 'kafka', 'rabbitmq'
  ];

  const foundTech = [];
  for (const kw of TECH_KEYWORDS) {
    const re = new RegExp(`\\b${kw.replace('.', '\\.')}\\b`, 'i');
    if (re.test(content)) {
      foundTech.push(kw);
    }
  }

  // 4. Soft Skills Extraction
  const SOFT_KEYWORDS = [
    'communication', 'collaboration', 'teamwork', 'problem solving', 'leadership',
    'critical thinking', 'agile', 'scrum', 'time management', 'mentoring', 'adaptability'
  ];
  const foundSoft = [];
  for (const kw of SOFT_KEYWORDS) {
    const re = new RegExp(`\\b${kw}\\b`, 'i');
    if (re.test(content)) {
      foundSoft.push(kw);
    }
  }

  // 5. Structure Requirements with Classification
  const requirements = [];

  // Categorize tech skills based on context
  foundTech.forEach((tech, idx) => {
    const isPreferred = new RegExp(`(nice to have|plus|preferred|bonus|optional).{0,60}\\b${tech}\\b`, 'i').test(content);
    const category = isPreferred ? 'PREFERRED' : 'REQUIRED';
    const importanceScore = category === 'REQUIRED' ? Math.max(7, 10 - Math.floor(idx / 3)) : 5;

    requirements.push({
      text: tech,
      category,
      importanceScore,
      skillKey: tech,
    });
  });

  foundSoft.forEach((soft) => {
    requirements.push({
      text: soft,
      category: 'PREFERRED',
      importanceScore: 4,
      skillKey: soft,
    });
  });

  // Extract years of experience
  const expMatch = content.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|in)/i);
  const yearsExperience = expMatch ? parseInt(expMatch[1], 10) : null;

  return {
    title: detectedTitle,
    company: 'Target Organization',
    seniority,
    yearsExperience,
    requiredSkills: requirements.filter((r) => r.category === 'REQUIRED').map((r) => r.text),
    preferredSkills: requirements.filter((r) => r.category === 'PREFERRED').map((r) => r.text),
    technicalSkills: foundTech,
    softSkills: foundSoft,
    keywords: [...foundTech, ...foundSoft],
    requirementBreakdown: requirements,
    rawText: content,
  };
};

module.exports = {
  parseJobDescription,
};
