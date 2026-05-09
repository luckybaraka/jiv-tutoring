require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./infrastructure/database/mongoose.connection');
const logger = require('./shared/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('✅ Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 JIV Tutoring API running on port ${PORT}`);
      logger.info(`📚 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
