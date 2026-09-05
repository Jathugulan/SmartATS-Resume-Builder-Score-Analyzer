const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

// Helper to add Retry-After header to rate limit responses
const createHandler = (message, errorCode) => {
  return (req, res, next) => {
    // Calculate seconds until rate limit resets
    const resetTime = req.rateLimit.resetTime;
    const now = Date.now();
    const retryAfter = Math.ceil((resetTime - now) / 1000) || 60;
    res.set('Retry-After', String(Math.max(1, retryAfter)));
    return errorResponse(res, message, errorCode, 429);
  };
};

// Global rate limiter - applies to all /api routes
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many requests, please try again later', 'RATE_LIMIT_EXCEEDED'),
});

// Stricter limiter for auth routes to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many authentication attempts, please try again later', 'AUTH_RATE_LIMIT_EXCEEDED'),
});

// Dedicated limiter for AI analysis endpoint
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 analysis requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many resume analysis requests, please try again later', 'ANALYSIS_RATE_LIMIT_EXCEEDED'),
  // Do not use an analysis attempt that fails before it can be processed.
  // Provider-side 429s are handled separately and should not consume this limit.
  skipFailedRequests: true,
});

module.exports = {
  standardLimiter,
  authLimiter,
  analyzeLimiter,
};
