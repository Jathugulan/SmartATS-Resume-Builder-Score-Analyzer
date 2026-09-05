const express = require('express');
const {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  analyzeResume,
  matchJobDescription,
  exportLatex,
  exportPdf,
} = require('../controllers/resumeCrudController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// All resume routes require authentication
router.use(requireAuth);

router.get('/', getResumes);
router.post('/', createResume);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

router.post('/:id/analyze', analyzeResume);
router.post('/:id/job-match', matchJobDescription);
router.post('/:id/latex', exportLatex);
router.post('/:id/pdf', exportPdf);

module.exports = router;
