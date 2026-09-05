/**
 * Multi-Job Resume Matching Service
 * Compares one resume against multiple target Job Descriptions simultaneously
 */

const { evaluateSemanticMatch } = require('./semanticMatchService');
const { parseJobDescription } = require('./jdIntelligenceService');

const compareResumeAgainstMultipleJobs = (resumeSkills = [], resumeText = '', jobList = []) => {
  const comparisons = jobList.map((job, idx) => {
    const parsed = typeof job === 'string' ? parseJobDescription(job) : job;
    const evaluation = evaluateSemanticMatch(resumeSkills, resumeText, parsed.requiredSkills || parsed.keywords || []);

    return {
      id: parsed._id || `job-${idx + 1}`,
      jobTitle: parsed.title || `Target Role ${idx + 1}`,
      company: parsed.company || 'Company',
      matchScore: evaluation.matchScore,
      exactMatches: evaluation.exactMatches.map((m) => m.requirement),
      semanticMatches: evaluation.semanticMatches.map((m) => `${m.requirement} ↔ ${m.matchedWith}`),
      missingSkills: evaluation.missingMatches.map((m) => m.requirement),
      recommendedVersion: `${parsed.title || 'Role'} Tailored`,
      recommendedTemplate: evaluation.matchScore >= 85 ? 'Template-01 (Engineering)' : 'Template-02 (ModernCV)',
    };
  });

  comparisons.sort((a, b) => b.matchScore - a.matchScore);

  return {
    bestMatch: comparisons[0] || null,
    scoreboard: comparisons,
  };
};

module.exports = {
  compareResumeAgainstMultipleJobs,
};
