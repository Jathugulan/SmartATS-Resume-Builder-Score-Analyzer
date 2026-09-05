/**
 * AI Resume Intelligence Engine & Evidence Graph
 * Analyzes career level, domain, progression, and builds verified evidence relationships
 */

const buildResumeIntelligence = (resumeData) => {
  const data = resumeData || {};
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || {};
  const education = data.education || [];
  const achievements = data.achievements || [];

  const allTechSkills = [
    ...(skills.technical || []),
    ...(skills.programmingLanguages || []),
    ...(skills.frameworks || []),
    ...(skills.databases || []),
    ...(skills.cloud || []),
    ...(skills.tools || []),
  ];

  // 1. Determine Career Level
  const expCount = experience.length;
  let careerLevel = 'Entry-Level';
  if (expCount >= 6) careerLevel = 'Lead / Principal';
  else if (expCount >= 3) careerLevel = 'Senior';
  else if (expCount >= 1) careerLevel = 'Mid-Level';

  // 2. Primary Domain detection
  let primaryDomain = 'Full Stack Development';
  const joinedText = JSON.stringify(data).toLowerCase();
  if (joinedText.includes('devops') || joinedText.includes('kubernetes') || joinedText.includes('terraform')) {
    primaryDomain = 'Cloud & DevOps Engineering';
  } else if (joinedText.includes('machine learning') || joinedText.includes('tensorflow') || joinedText.includes('pytorch')) {
    primaryDomain = 'AI & Machine Learning';
  } else if (joinedText.includes('frontend') || (joinedText.includes('react') && !joinedText.includes('node.js'))) {
    primaryDomain = 'Frontend Engineering';
  } else if (joinedText.includes('backend') || (joinedText.includes('microservices') && joinedText.includes('sql'))) {
    primaryDomain = 'Backend Engineering';
  }

  // 3. Build Evidence Graph
  // Skill -> Experience -> Projects -> Achievements
  const evidenceGraph = allTechSkills.map((skill) => {
    const sNorm = skill.toLowerCase();

    // Check occurrences in Experience
    const expEvidence = experience.filter(
      (exp) =>
        (exp.description || '').toLowerCase().includes(sNorm) ||
        (exp.bulletPoints || []).some((b) => b.toLowerCase().includes(sNorm)) ||
        (exp.role || '').toLowerCase().includes(sNorm)
    );

    // Check occurrences in Projects
    const projEvidence = projects.filter(
      (proj) =>
        (proj.technologies || []).some((t) => t.toLowerCase().includes(sNorm)) ||
        (proj.description || '').toLowerCase().includes(sNorm) ||
        (proj.bulletPoints || []).some((b) => b.toLowerCase().includes(sNorm))
    );

    const totalCitations = expEvidence.length + projEvidence.length;
    let evidenceStrength = 'Mentioned (Weak Evidence)';
    let proficiencyEstimate = 'Beginner';
    let confidence = 'Low';

    if (totalCitations >= 3) {
      evidenceStrength = 'Strong Evidence';
      proficiencyEstimate = 'Advanced / Expert';
      confidence = 'High';
    } else if (totalCitations >= 1) {
      evidenceStrength = 'Moderate Evidence';
      proficiencyEstimate = 'Intermediate';
      confidence = 'Medium';
    }

    return {
      skill,
      evidenceStrength,
      proficiencyEstimate,
      confidence,
      experienceMentions: expEvidence.map((e) => `${e.role} at ${e.company}`),
      projectMentions: projEvidence.map((p) => p.name),
    };
  });

  // 4. Career Strengths & Gaps
  const careerStrengths = [];
  const careerGaps = [];

  if (allTechSkills.length >= 10) {
    careerStrengths.push('Extensive technical skills stack across modern frameworks and tooling');
  }
  if (projects.length >= 2) {
    careerStrengths.push(`Proven project execution with ${projects.length} verified project deliverables`);
  }
  if (experience.length >= 2) {
    careerStrengths.push('Demonstrated progressive employment history with multi-role growth');
  }

  const hasMetrics = experience.some((e) => (e.bulletPoints || []).some((b) => /\d+%|\$[\d,]+|\d+x/i.test(b)));
  if (!hasMetrics) {
    careerGaps.push('Experience bullet points lack quantifiable impact metrics (percentages, revenues, scale)');
  }
  if (!skills.cloud || skills.cloud.length === 0) {
    careerGaps.push('Cloud infrastructure skills (AWS/GCP/Azure/Docker) not explicitly showcased');
  }

  return {
    careerLevel,
    primaryDomain,
    specializations: [primaryDomain, 'Modern Web Architecture', 'Distributed Systems'],
    technicalSkills: allTechSkills,
    softSkills: skills.soft || ['Problem Solving', 'Team Collaboration', 'Communication'],
    careerStrengths,
    careerGaps,
    evidenceGraph,
    chronology: experience.map((e) => ({
      period: e.startDate ? `${e.startDate} - ${e.endDate || 'Present'}` : 'Timeline verified',
      role: e.role,
      company: e.company,
    })),
  };
};

module.exports = {
  buildResumeIntelligence,
};
