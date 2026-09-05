const express = require('express');
const {
  getTemplates,
  getTemplateById,
  uploadTemplate,
  duplicateTemplate,
} = require('../controllers/templateController');
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadTemplateFile } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', getTemplates);
router.post('/upload', uploadTemplateFile, uploadTemplate);
router.get('/:id', getTemplateById);
router.post('/:id/duplicate', duplicateTemplate);

module.exports = router;
