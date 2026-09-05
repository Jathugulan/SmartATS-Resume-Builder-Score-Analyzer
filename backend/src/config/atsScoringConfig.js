/**
 * SmartATS Configurable ATS Scoring Weights
 * Total: 100 points
 * 
 * Default Distribution:
 * - Formatting: 20 points
 * - Keywords: 25 points
 * - Skills: 20 points
 * - Experience: 15 points
 * - Education: 10 points
 * - Content: 10 points
 */
const ATS_SCORING_WEIGHTS = {
  formatting: 20,
  keywords: 25,
  skills: 20,
  experience: 15,
  education: 10,
  content: 10,
};

const ATS_SCORE_DISCLAIMER = 'Estimated ATS Compatibility Score';

module.exports = {
  ATS_SCORING_WEIGHTS,
  ATS_SCORE_DISCLAIMER,
};
