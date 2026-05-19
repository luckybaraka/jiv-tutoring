const nodemailer = require('nodemailer');
const logger = require('../../shared/logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = process.env.EMAIL_SECURE
    ? process.env.EMAIL_SECURE === 'true'
    : port === 465;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) {
      logger.warn('Email transporter verification failed:', err.message);
    } else {
      logger.info('📧 Email transporter ready');
    }
  });

  return transporter;
};

module.exports = { getTransporter };
