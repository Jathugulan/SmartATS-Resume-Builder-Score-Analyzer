const express = require('express');
const {
  getVersions,
  createVersion,
  compareVersions,
} = require('../controllers/versionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/resume/:id', getVersions);
router.post('/resume/:id', createVersion);
router.post('/compare', compareVersions);

module.exports = router;
