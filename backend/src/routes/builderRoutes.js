const express = require('express');
const {
  getResumes,
  createResume,
  createResumeFromAnalysis,
  getResumeById,
  updateResume,
  deleteResume,
  renderResumeLatex,
  compileResumePdf,
  exportOverleafZip,
  exportPackageZip,
} = require('../controllers/builderController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', getResumes);
router.post('/', createResume);
router.post('/from-analysis/:analysisId', createResumeFromAnalysis);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

router.get('/:id/latex', renderResumeLatex);
router.get('/:id/pdf', compileResumePdf);
router.get('/:id/export/overleaf', exportOverleafZip);
router.post('/:id/export/package', exportPackageZip);

module.exports = router;
