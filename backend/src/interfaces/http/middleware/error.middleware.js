const logger = require('../../../shared/logger');
const { AppError } = require('../../../shared/errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      type: err.name,
    });
  }

  logger.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { detail: err.message }),
  });
};

module.exports = errorHandler;
