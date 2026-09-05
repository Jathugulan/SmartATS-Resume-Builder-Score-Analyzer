/**
 * Recruiter View Simulation Service
 * Simulates a realistic 6-second recruiter review of the candidate resume
 */

const simulateRecruiterReview = (resumeData, jobDescriptionData = null) => {
  const resume = resumeData || {};
  const skills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.programmingLanguages || []),
    ...(resume.skills?.frameworks || []),
  ];
  const exp = resume.experience || [];
  const projects = resume.projects || [];

  // 1. First Impression
  let firstImpression = 'Solid technical profile with clear section demarcation and relevant modern stack.';
  if (skills.length >= 10 && exp.length >= 2) {
    firstImpression = 'High-potential candidate with solid demonstrated breadth across frontend, backend, and database technologies.';
  } else if (skills.length < 5) {
    firstImpression = 'Candidate profile appears early-stage with opportunities to showcase additional core tooling.';
  }

  // 2. Top Strengths
  const topStrengths = [];
  if (skills.length > 0) {
    topStrengths.push(`Strong core stack presence: ${skills.slice(0, 5).join(', ')}`);
  }
  if (projects.length >= 2) {
    topStrengths.push(`Multiple practical project deliverables (${projects.length} verified projects) demonstrating hands-on execution`);
  }
  if (resume.education && resume.education.length > 0) {
    topStrengths.push(`Degree verified: ${resume.education[0].degree} from ${resume.education[0].institution}`);
  }

  // 3. Potential Concerns
  const potentialConcerns = [];
  const hasQuant = exp.some((e) => (e.bulletPoints || []).some((b) => /\d+%|\$[\d,]+|\d+x/i.test(b)));
  if (!hasQuant) {
    potentialConcerns.push('Limited measurable business impact cited; achievements could be strengthened with concrete percentages or volumes.');
  }
  if (!resume.personal?.linkedin) {
    potentialConcerns.push('No LinkedIn profile URL provided in contact header, slowing down recruiter identity verification.');
  }

  // 4. Recommendation
  let recommendation = 'Potential Match';
  let matchBadge = 'bg-blue-50 text-blue-700 border-blue-200';
  if (skills.length >= 8 && exp.length >= 1) {
    recommendation = 'Strong Match';
    matchBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (skills.length < 4) {
    recommendation = 'Weak Match';
    matchBadge = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return {
    simulationType: '6-Second Recruiter Screen',
    firstImpression,
    topStrengths,
    potentialConcerns,
    recommendation,
    matchBadge,
    candidateSummary: {
      fullName: resume.personal?.fullName || 'Candidate',
      role: resume.personal?.professionalTitle || 'Software Engineer',
      yearsEstimated: exp.length >= 2 ? `${exp.length}+ years` : 'Early career',
      keySkills: skills.slice(0, 8),
    },
    disclaimer: 'AI simulation based on typical tech recruitment screening criteria. Does not represent a decision by any real human employer.',
  };
};

module.exports = {
  simulateRecruiterReview,
};
