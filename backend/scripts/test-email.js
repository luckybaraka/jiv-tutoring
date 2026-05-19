#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { getTransporter } = require('../src/infrastructure/email/transporter');

const recipient = process.argv[2] || process.env.ADMIN_EMAIL;

if (!recipient) {
  console.error('Usage: node scripts/test-email.js <recipient@example.com>');
  process.exit(1);
}

(async () => {
  console.log('SMTP config:');
  console.log('  host  =', process.env.EMAIL_HOST);
  console.log('  port  =', process.env.EMAIL_PORT);
  console.log('  user  =', process.env.EMAIL_USER);
  console.log('  pass  =', process.env.EMAIL_PASS ? '*** set' : '!!! MISSING');
  console.log('  to    =', recipient);

  try {
    const transporter = getTransporter();
    await new Promise((resolve, reject) =>
      transporter.verify((err) => (err ? reject(err) : resolve()))
    );
    console.log('\nSMTP verify OK. Sending test message...');

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'JIV Tutoring'}" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: 'JIV Tutoring SMTP test',
      text: 'If you can read this, the booking confirmation emails will go out.',
    });
    console.log('Sent:', info.messageId, info.response);
    process.exit(0);
  } catch (err) {
    console.error('\nSMTP test FAILED:', err.message);
    if (err.code) console.error('code:', err.code);
    if (err.response) console.error('response:', err.response);
    process.exit(1);
  }
})();
