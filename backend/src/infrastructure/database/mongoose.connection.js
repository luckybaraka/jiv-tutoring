const mongoose = require('mongoose');
const logger = require('../../shared/logger');
const authService = require('../../domains/admin/services/AuthService');
const schedulingService = require('../../domains/scheduling/services/SchedulingService');

const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiv_tutoring';
    await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Bootstrap defaults
    await authService.ensureDefaultAdmin();
    await schedulingService.ensureDefaultAvailability();
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

module.exports = { connectDatabase };
