const { Resend } = require('resend');
const logger = require('../../shared/logger');

let client = null;

const getResend = () => {
  if (client) return client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  client = new Resend(apiKey);
  logger.info('Resend client initialized');
  return client;
};

module.exports = { getResend };
