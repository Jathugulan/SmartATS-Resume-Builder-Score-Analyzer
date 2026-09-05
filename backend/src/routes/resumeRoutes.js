const express = require('express');
const {
  upload,
  analyze,
  history,
  getAnalysis,
  updateCandidate,
  deleteAnalysis,
} = require('../controllers/resumeController');
const { generateReport } = require('../controllers/reportController');
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');
const { analyzeLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All resume operations require authentication
router.use(requireAuth);

router.post('/upload', uploadResume, upload);
router.post('/analyze', analyzeLimiter, uploadResume, analyze);
router.get('/history', history);
router.get('/:id', getAnalysis);
router.patch('/:id/candidate', updateCandidate);
router.delete('/:id', deleteAnalysis);
router.post('/:id/report', generateReport);

module.exports = router;
