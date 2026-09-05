/**
 * Skill Gap & Personalized Learning Roadmap Service
 * Evaluates Already Strong, Needs Improvement, Missing, Optional
 * Formulates structured 30/60/90-Day learning roadmaps
 */

const evaluateSkillGaps = (resumeSkills = [], jdRequiredSkills = [], jdPreferredSkills = []) => {
  const normResume = (resumeSkills || []).map((s) => s.toLowerCase());

  const alreadyStrong = [];
  const needsImprovement = [];
  const missing = [];
  const optional = [];

  // Check required skills
  for (const req of jdRequiredSkills) {
    const rLower = req.toLowerCase();
    if (normResume.includes(rLower) || normResume.some((s) => s.includes(rLower) || rLower.includes(s))) {
      alreadyStrong.push(req);
    } else {
      missing.push(req);
    }
  }

  // Check preferred skills
  for (const pref of jdPreferredSkills) {
    const pLower = pref.toLowerCase();
    if (normResume.includes(pLower) || normResume.some((s) => s.includes(pLower) || pLower.includes(s))) {
      alreadyStrong.push(pref);
    } else {
      optional.push(pref);
    }
  }

  // Generate 30-Day, 60-Day, 90-Day roadmap
  const roadmap30 = [];
  const roadmap60 = [];
  const roadmap90 = [];

  const topMissing = [...missing, ...optional];

  if (topMissing.length > 0) {
    roadmap30.push({
      phase: 'Weeks 1 - 4 (Core Prerequisites)',
      targetSkill: topMissing[0],
      weeklyGoals: [
        `Week 1: Foundations & Architecture of ${topMissing[0]}`,
        `Week 2: Hands-on implementation & configuration`,
        `Week 3: Build mini-service incorporating ${topMissing[0]}`,
        `Week 4: Unit testing & edge case verification`,
      ],
      estimatedHoursPerWeek: 6,
    });
  }

  if (topMissing.length > 1) {
    roadmap60.push({
      phase: 'Weeks 5 - 8 (Intermediate Integration)',
      targetSkill: topMissing[1],
      weeklyGoals: [
        `Week 5: Core concepts of ${topMissing[1]} in production environments`,
        `Week 6: Integration with ${topMissing[0] || 'core stack'}`,
        `Week 7: Performance profiling and optimization`,
        `Week 8: End-to-end testing and deployment automation`,
      ],
      estimatedHoursPerWeek: 8,
    });
  }

  if (topMissing.length > 2) {
    roadmap90.push({
      phase: 'Weeks 9 - 12 (Advanced Portfolio Project)',
      targetSkill: topMissing[2],
      weeklyGoals: [
        `Week 9: Deep dive into ${topMissing[2]} best practices`,
        `Week 10: Architectural design for portfolio project`,
        `Week 11: Production deployment with CI/CD`,
        `Week 12: Resume update and evidence documentation`,
      ],
      estimatedHoursPerWeek: 10,
    });
  }

  return {
    skillGaps: {
      alreadyStrong,
      needsImprovement,
      missing,
      optional,
    },
    learningRoadmap: {
      days30: roadmap30,
      days60: roadmap60,
      days90: roadmap90,
      disclaimer: 'Suggested learning path based on JD requirements. Does not alter your current resume profile until verified.',
    },
  };
};

module.exports = {
  evaluateSkillGaps,
};
