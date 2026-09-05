const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response');
const env = require('../config/env');

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND', 404);
};

const errorHandler = (err, req, res, next) => {
  // Log internal error for debugging
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
  if (env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return errorResponse(
      res,
      'Validation error: ' + issues.map((i) => i.message).join('; '),
      'VALIDATION_ERROR',
      400,
      issues
    );
  }

  // MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return errorResponse(
      res,
      `A user or resource with that ${field} already exists`,
      'DUPLICATE_RESOURCE',
      409
    );
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid identifier format: ${err.value}`, 'INVALID_ID', 400);
  }

  // Custom Application Error
  if (err.statusCode && err.code) {
    if (err.statusCode === 429 && err.retryAfter) {
      const seconds = Math.max(1, Math.ceil(Number(err.retryAfter)));
      if (Number.isFinite(seconds)) {
        res.set('Retry-After', String(seconds));
      }
    }
    return errorResponse(res, err.message, err.code, err.statusCode, err.details || null);
  }

  // SyntaxError (e.g. invalid JSON payload in request)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'Malformed JSON payload in request body', 'INVALID_JSON', 400);
  }

  // Default Internal Server Error
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err.message || 'Internal Server Error';

  return errorResponse(res, message, 'INTERNAL_SERVER_ERROR', 500);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
