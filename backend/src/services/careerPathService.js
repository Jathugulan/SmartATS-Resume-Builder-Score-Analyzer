/**
 * Career Path Intelligence Service
 * Identifies role alignment, gaps, and growth opportunities based on resume evidence
 */

const BENCHMARK_ROLES = [
  {
    role: 'Full Stack Developer',
    coreSkills: ['react', 'node.js', 'javascript', 'typescript', 'mongodb', 'sql', 'git', 'rest'],
    industryDemand: 'High',
  },
  {
    role: 'Frontend Developer',
    coreSkills: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind css', 'next.js'],
    industryDemand: 'High',
  },
  {
    role: 'Backend Developer',
    coreSkills: ['node.js', 'express', 'python', 'sql', 'postgresql', 'mongodb', 'redis', 'rest api', 'docker'],
    industryDemand: 'Very High',
  },
  {
    role: 'DevOps / Cloud Engineer',
    coreSkills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'git', 'bash'],
    industryDemand: 'High',
  },
  {
    role: 'AI / Machine Learning Engineer',
    coreSkills: ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'sql'],
    industryDemand: 'Emerging High',
  },
];

const analyzeCareerPaths = (resumeSkills = []) => {
  const normSkills = (resumeSkills || []).map((s) => s.toLowerCase());

  const recommendations = BENCHMARK_ROLES.map((benchmark) => {
    const matched = benchmark.coreSkills.filter((s) =>
      normSkills.some((userSkill) => userSkill.includes(s) || s.includes(userSkill))
    );
    const missing = benchmark.coreSkills.filter((s) => !matched.includes(s));
    const matchPercentage = Math.round((matched.length / benchmark.coreSkills.length) * 100);

    return {
      role: benchmark.role,
      matchPercentage,
      industryDemand: benchmark.industryDemand,
      existingStrengths: matched,
      skillGaps: missing,
      recommendedTemplate: matchPercentage >= 80 ? 'Classic Engineering (Template-01)' : 'ModernCV Banking (Template-02)',
      readiness: matchPercentage >= 80 ? 'Strong Fit' : matchPercentage >= 60 ? 'Potential Fit' : 'Requires Growth',
    };
  });

  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    topMatchRole: recommendations[0]?.role || 'Full Stack Developer',
    careerPaths: recommendations,
    disclaimer: 'Career path estimates are evidence-based simulations to guide preparation, not recruitment guarantees.',
  };
};

module.exports = {
  analyzeCareerPaths,
};
