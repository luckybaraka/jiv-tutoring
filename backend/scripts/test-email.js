#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const recipient = process.argv[2] || process.env.ADMIN_EMAIL;

if (!recipient) {
  console.error('Usage: node scripts/test-email.js <recipient@example.com>');
  process.exit(1);
}

const useResend = !!process.env.RESEND_API_KEY;

(async () => {
  if (useResend) {
    console.log('Mode: Resend (HTTPS API)');
    console.log('  from  =', process.env.RESEND_FROM);
    console.log('  key   =', process.env.RESEND_API_KEY ? '*** set' : '!!! MISSING');
    console.log('  to    =', recipient);

    try {
      const { getResend } = require('../src/infrastructure/email/resendClient');
      const resend = getResend();
      const fromName = process.env.EMAIL_FROM_NAME || 'JIV Tutoring';
      const fromAddress = process.env.RESEND_FROM || 'info@jivtutoring.com';
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromAddress}>`,
        to: [recipient],
        subject: 'JIV Tutoring Resend test',
        html: '<p>If you can read this, booking emails will deliver from production.</p>',
      });
      if (error) {
        console.error('\nResend test FAILED:', error);
        process.exit(1);
      }
      console.log('Sent. id =', data && data.id);
      process.exit(0);
    } catch (err) {
      console.error('\nResend test FAILED:', err.message);
      process.exit(1);
    }
  }

  console.log('Mode: SMTP fallback (no RESEND_API_KEY set)');
  console.log('  host  =', process.env.EMAIL_HOST);
  console.log('  port  =', process.env.EMAIL_PORT);
  console.log('  user  =', process.env.EMAIL_USER);
  console.log('  pass  =', process.env.EMAIL_PASS ? '*** set' : '!!! MISSING');
  console.log('  to    =', recipient);

  try {
    const { getTransporter } = require('../src/infrastructure/email/transporter');
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
