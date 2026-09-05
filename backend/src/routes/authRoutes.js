const express = require('express');
const { register, login, me, logout, forgotPassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);
router.post('/forgot-password', authLimiter, forgotPassword);

module.exports = router;
