const express = require('express');
const {
  getResumeIntelligence,
  analyzeJob,
  matchResumeWithJob,
  multiJobMatch,
  getCareerPaths,
  optimizeResume,
  improveBullet,
  simulateScore,
  scanRisks,
  checkLinkedInConsistency,
  checkPortfolioConsistency,
  createCoverLetter,
  getRecruiterSimulation,
  getInterviewQuestions,
  evaluateAnswer,
  chatAssistant,
} = require('../controllers/intelligenceController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/resume/:id', getResumeIntelligence);
router.post('/job/analyze', analyzeJob);
router.post('/match', matchResumeWithJob);
router.post('/multi-match', multiJobMatch);
router.get('/career-paths/:id', getCareerPaths);
router.post('/optimize', optimizeResume);
router.post('/bullet/improve', improveBullet);
router.post('/simulate-score', simulateScore);
router.get('/risks/:id', scanRisks);
router.post('/consistency/linkedin', checkLinkedInConsistency);
router.post('/consistency/portfolio', checkPortfolioConsistency);
router.post('/cover-letter', createCoverLetter);
router.get('/recruiter-simulation/:id', getRecruiterSimulation);
router.get('/interview/questions/:id', getInterviewQuestions);
router.post('/interview/evaluate', evaluateAnswer);
router.post('/chat', chatAssistant);

module.exports = router;
