const { z } = require('zod');

const nullableString = z.string().nullable().default(null);
const stringArray = z.array(z.string()).default([]);

const candidateSchema = z.object({
  fullName: nullableString,
  email: nullableString,
  phone: nullableString,
  location: nullableString,
  linkedIn: nullableString,
  gitHub: nullableString,
  portfolio: nullableString,
  professionalTitle: nullableString,
  summary: nullableString,
}).default({});

const sectionSchema = z.object({
  name: z.string(),
  present: z.boolean().default(false),
  quality: z.string().default('absent'),
});

const experienceItemSchema = z.object({
  jobTitle: nullableString,
  company: nullableString,
  period: nullableString,
  responsibilities: stringArray,
  technologies: stringArray,
  quantifiedImpact: stringArray,
});

const educationItemSchema = z.object({
  institution: nullableString,
  degree: nullableString,
  field: nullableString,
  graduationYear: nullableString,
  gpa: nullableString,
});

const certificationItemSchema = z.object({
  name: nullableString,
  issuingOrganization: nullableString,
  date: nullableString,
  credentialId: nullableString,
});

const projectItemSchema = z.object({
  title: nullableString,
  description: nullableString,
  technologies: stringArray,
  link: nullableString,
});

const partialSkillSchema = z.object({
  skill: z.string(),
  context: z.string().default(''),
});

const matchingSchema = z.object({
  matchedSkills: stringArray,
  missingSkills: stringArray,
  partialSkills: z.array(partialSkillSchema).default([]),
  matchedKeywords: stringArray,
  missingKeywords: stringArray,
}).default({});

const atsRiskSchema = z.object({
  severity: z.enum(['high', 'medium', 'low']).default('medium'),
  category: z.string().default('General'),
  issue: z.string(),
  remediation: z.string().default(''),
});

const recommendationSchema = z.object({
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  category: z.string().default('General'),
  recommendation: z.string(),
  evidence: z.string().default(''),
});

const scoreCategoryEvidenceSchema = z.object({
  evidence: stringArray,
  explanation: z.string().default(''),
});

const scoreEvidenceSchema = z.object({
  keywordSkillMatch: scoreCategoryEvidenceSchema,
  jobDescriptionRelevance: scoreCategoryEvidenceSchema,
  atsStructure: scoreCategoryEvidenceSchema,
  relevantExperience: scoreCategoryEvidenceSchema,
  educationCertifications: scoreCategoryEvidenceSchema,
  achievementsImpact: scoreCategoryEvidenceSchema,
  formattingReadability: scoreCategoryEvidenceSchema,
});

const rawScoresSchema = z.object({
  keywordSkillMatch: z.number().min(0).max(100),
  jobDescriptionRelevance: z.number().min(0).max(100),
  atsStructure: z.number().min(0).max(100),
  relevantExperience: z.number().min(0).max(100),
  educationCertifications: z.number().min(0).max(100),
  achievementsImpact: z.number().min(0).max(100),
  formattingReadability: z.number().min(0).max(100),
});

const aiAnalysisResponseSchema = z.object({
  candidate: candidateSchema,
  sectionsDetected: z.array(sectionSchema).default([]),
  skills: z.object({
    technical: stringArray,
    tools: stringArray,
    soft: stringArray,
    domain: stringArray,
  }).default({ technical: [], tools: [], soft: [], domain: [] }),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  achievements: stringArray,
  jobDescriptionAnalysis: z.object({
    targetRole: nullableString,
    requiredSkills: stringArray,
    preferredSkills: stringArray,
    responsibilities: stringArray,
    qualifications: stringArray,
    keywords: stringArray,
  }).default({
    targetRole: null,
    requiredSkills: [],
    preferredSkills: [],
    responsibilities: [],
    qualifications: [],
    keywords: [],
  }),
  matching: matchingSchema,
  atsRisks: z.array(atsRiskSchema).default([]),
  strengths: stringArray,
  weaknesses: stringArray,
  recommendations: z.array(recommendationSchema).default([]),
  rawScores: rawScoresSchema,
  scoreEvidence: scoreEvidenceSchema,
  finalVerdict: z.string().min(5, 'Final verdict must be provided'),
});

module.exports = {
  aiAnalysisResponseSchema,
  rawScoresSchema,
};
