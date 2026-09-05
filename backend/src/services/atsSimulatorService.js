/**
 * What-If ATS Simulator
 * Allows users to simulate score impacts of adding skills, metrics, or sections
 * without modifying the underlying resume.
 */

const simulateScoreChanges = (currentScore = 75, activeToggles = {}) => {
  let simulatedScore = currentScore;
  const breakdownDeltas = [];

  if (activeToggles.addMissingSkills) {
    simulatedScore += 8;
    breakdownDeltas.push({
      factor: 'Target Job Keyword Alignment',
      delta: '+8 pts',
      explanation: 'Closes key domain requirement gaps in Keyword/Skill Match category.',
    });
  }

  if (activeToggles.addQuantifiableMetrics) {
    simulatedScore += 6;
    breakdownDeltas.push({
      factor: 'Quantified Impact Metrics',
      delta: '+6 pts',
      explanation: 'Supplies percentage, performance, or financial scale data in Achievements & Experience.',
    });
  }

  if (activeToggles.optimizeSummary) {
    simulatedScore += 3;
    breakdownDeltas.push({
      factor: 'Tailored Professional Summary',
      delta: '+3 pts',
      explanation: 'Elevates profile cohesion and recruiter keyword indexing.',
    });
  }

  if (activeToggles.fixSectionFormatting) {
    simulatedScore += 4;
    breakdownDeltas.push({
      factor: 'Standard ATS Section Hierarchy',
      delta: '+4 pts',
      explanation: 'Resolves parsing ambiguity and eliminates risk flags.',
    });
  }

  simulatedScore = Math.min(99, Math.max(0, Math.round(simulatedScore)));
  const totalDelta = simulatedScore - currentScore;

  return {
    currentScore,
    simulatedScore,
    totalDelta: totalDelta > 0 ? `+${totalDelta}` : `${totalDelta}`,
    breakdownDeltas,
    disclaimer: 'Simulation / estimate only. Final ATS score depends on full document parsing verification.',
  };
};

module.exports = {
  simulateScoreChanges,
};
