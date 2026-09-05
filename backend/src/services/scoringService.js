/**
 * ATS Scoring Service
 * Implements deterministic, reproducible 7-category ATS scoring calculation.
 */

const CATEGORY_WEIGHTS = {
  keywordSkillMatch: 30,
  jobDescriptionRelevance: 25,
  atsStructure: 15,
  relevantExperience: 15,
  educationCertifications: 5,
  achievementsImpact: 5,
  formattingReadability: 5,
};

const getRatingLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

/**
 * Calculates weighted scores and composite ATS score.
 *
 * @param {Object} rawScores - Object containing raw scores (0-100) for all 7 categories
 * @param {Object} scoreEvidence - Evidence citations and explanations for each category
 * @param {boolean} jdProvided - Whether a Job Description was supplied
 * @returns {Object} { atsScore, rating, scoreBreakdown }
 */
const calculateAtsScore = (rawScores, scoreEvidence, jdProvided = true) => {
  const breakdown = {};
  let totalWeightedScore = 0;

  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    let raw = rawScores[category];

    // Ensure raw score is valid number
    if (typeof raw !== 'number' || isNaN(raw)) {
      raw = 50; // Fallback to neutral midpoint if omitted
    }

    // Clamp raw score between 0 and 100
    raw = Math.max(0, Math.min(100, Math.round(raw)));

    // Calculate weighted contribution
    const weighted = parseFloat(((raw / 100) * weight).toFixed(2));
    totalWeightedScore += weighted;

    const evidenceObj = (scoreEvidence && scoreEvidence[category]) || {};
    let evidence = Array.isArray(evidenceObj.evidence) ? evidenceObj.evidence : [];
    let explanation = evidenceObj.explanation || '';

    // If no JD was provided, clarify fallback context in categories 1 and 2
    if (!jdProvided) {
      if (category === 'keywordSkillMatch') {
        explanation =
          explanation ||
          'Calculated based on overall skill portfolio depth and industry benchmark standards (No target Job Description provided).';
      } else if (category === 'jobDescriptionRelevance') {
        explanation =
          explanation ||
          'Calculated based on internal career profile consistency and role cohesion (No target Job Description provided).';
      }
    }

    breakdown[category] = {
      raw,
      weight,
      weighted,
      evidence,
      explanation,
    };
  }

  // Clamp total score between 0 and 100 and round to 1 decimal place
  const atsScore = Math.max(0, Math.min(100, parseFloat(totalWeightedScore.toFixed(1))));
  const rating = getRatingLabel(atsScore);

  return {
    atsScore,
    rating,
    scoreBreakdown: breakdown,
  };
};

module.exports = {
  CATEGORY_WEIGHTS,
  getRatingLabel,
  calculateAtsScore,
};
