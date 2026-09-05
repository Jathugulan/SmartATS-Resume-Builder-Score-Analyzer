/**
 * Consistency Analyzer Service
 * Compares resume information against user-provided LinkedIn and Portfolio content
 * Detects: Consistent, Different, Missing, Potential Conflict
 */

const analyzeLinkedInConsistency = (resumeData, linkedInText = '') => {
  const text = (linkedInText || '').toLowerCase();
  const resume = resumeData || {};

  const comparisons = [];

  // 1. Name Check
  if (resume.personal?.fullName) {
    const rName = resume.personal.fullName.toLowerCase();
    const isPresent = text.includes(rName);
    comparisons.push({
      item: 'Candidate Name',
      resumeValue: resume.personal.fullName,
      status: isPresent ? 'Consistent' : 'Missing on Provided LinkedIn Text',
      notes: isPresent ? 'Matches profile identity exactly.' : 'Verify profile display name matches resume.',
    });
  }

  // 2. Title Check
  if (resume.personal?.professionalTitle) {
    const rTitle = resume.personal.professionalTitle.toLowerCase();
    const isPresent = text.includes(rTitle);
    comparisons.push({
      item: 'Headline / Current Title',
      resumeValue: resume.personal.professionalTitle,
      status: isPresent ? 'Consistent' : 'Potential Discrepancy',
      notes: isPresent
        ? 'Headline alignment confirmed.'
        : 'Resume title differs from provided LinkedIn text; ensure alignment for recruiter cross-checking.',
    });
  }

  // 3. Companies Check
  (resume.experience || []).forEach((exp) => {
    const company = (exp.company || '').toLowerCase();
    if (company) {
      const isPresent = text.includes(company);
      comparisons.push({
        item: `Experience: ${exp.company}`,
        resumeValue: `${exp.role} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`,
        status: isPresent ? 'Consistent' : 'Different / Missing',
        notes: isPresent
          ? 'Employment entry verified in provided LinkedIn data.'
          : 'Employer mention not found in provided profile export.',
      });
    }
  });

  // 4. Skills overlap
  const resumeSkills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.programmingLanguages || []),
  ];
  const matchedSkills = resumeSkills.filter((s) => text.includes(s.toLowerCase()));

  return {
    overallConsistency: comparisons.every((c) => c.status === 'Consistent') ? 'High Alignment' : 'Minor Discrepancies',
    comparisons,
    verifiedSkillsOverlap: matchedSkills,
    disclaimer: 'Analysis is based solely on user-supplied LinkedIn text. No unauthorized scraping or automated profile access is performed.',
  };
};

const analyzePortfolioConsistency = (resumeData, portfolioContent = '') => {
  const text = (portfolioContent || '').toLowerCase();
  const projects = resumeData?.projects || [];

  const projectAlignments = projects.map((p) => {
    const isNamePresent = text.includes((p.name || '').toLowerCase());
    return {
      project: p.name,
      technologies: p.technologies || [],
      status: isNamePresent ? 'Consistent' : 'Not explicitly listed on portfolio',
      notes: isNamePresent ? 'Project found on portfolio.' : 'Ensure portfolio highlights key projects cited on resume.',
    };
  });

  return {
    portfolioAlignments: projectAlignments,
    disclaimer: 'Based strictly on user-provided portfolio content.',
  };
};

module.exports = {
  analyzeLinkedInConsistency,
  analyzePortfolioConsistency,
};
