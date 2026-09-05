/**
 * Standard API response envelope helpers
 */

const successResponse = (res, data = {}, message = null, statusCode = 200) => {
  const payload = {
    success: true,
    data,
  };
  if (message) {
    payload.message = message;
  }
  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    code,
    message,
  };
  if (details) {
    payload.details = details;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
