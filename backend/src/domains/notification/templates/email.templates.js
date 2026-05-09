/**
 * Branded HTML email templates (Blue + Yellow theme).
 */

const baseStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1e293b;
`;

const wrapper = (innerContent, preheader = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>JIV Tutoring</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;${baseStyle}">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a2e6f 0%,#1e40af 60%,#fbbf24 100%);padding:28px 32px;color:#ffffff;">
              <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:0.4px;">JIV Tutoring Services</h1>
              <p style="margin:6px 0 0;color:#fde68a;font-size:14px;">Empowering Learners. Inspiring Futures.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${innerContent}
            </td>
          </tr>
          <tr>
            <td style="background:#0a2e6f;color:#cbd5e1;padding:20px 32px;font-size:12px;text-align:center;">
              <p style="margin:0 0 6px;">JIV Tutoring Services • Nairobi, Kenya</p>
              <p style="margin:0;">📞 +254 726 555 444 &nbsp;|&nbsp; ✉️ joantheresa26@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const formatStudents = (students) =>
  students
    .map(
      (s, i) => `
      <tr>
        <td style="padding:8px 12px;background:${i % 2 === 0 ? '#f8fafc' : '#ffffff'};border-left:3px solid #fbbf24;">
          <strong>${s.name}</strong> &middot; Age ${s.age} &middot; ${s.gradeOrClass}
          ${s.learningChallenges ? `<br><span style="color:#64748b;font-size:13px;">Challenges: ${s.learningChallenges}</span>` : ''}
        </td>
      </tr>`
    )
    .join('');

const adminBookingTemplate = (booking) => {
  const date = new Date(booking.scheduledDate).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const inner = `
    <div style="background:#fef3c7;border-left:4px solid #fbbf24;padding:14px 18px;border-radius:8px;margin-bottom:24px;">
      <h2 style="margin:0;color:#0a2e6f;font-size:18px;">📚 New Booking Received</h2>
      <p style="margin:4px 0 0;color:#475569;font-size:14px;">A parent has just booked a session.</p>
    </div>

    <h3 style="color:#0a2e6f;border-bottom:2px solid #fbbf24;padding-bottom:6px;">Parent Details</h3>
    <table width="100%" cellspacing="0" cellpadding="6" style="font-size:14px;">
      <tr><td><strong>Full Name:</strong></td><td>${booking.parent.fullName}</td></tr>
      <tr><td><strong>Email:</strong></td><td><a href="mailto:${booking.parent.email}" style="color:#1e40af;">${booking.parent.email}</a></td></tr>
      <tr><td><strong>Phone:</strong></td><td><a href="tel:${booking.parent.phone}" style="color:#1e40af;">${booking.parent.phone}</a></td></tr>
    </table>

    <h3 style="color:#0a2e6f;border-bottom:2px solid #fbbf24;padding-bottom:6px;margin-top:24px;">Student(s)</h3>
    <table width="100%" cellspacing="0" cellpadding="0">${formatStudents(booking.students)}</table>

    <h3 style="color:#0a2e6f;border-bottom:2px solid #fbbf24;padding-bottom:6px;margin-top:24px;">Session Details</h3>
    <table width="100%" cellspacing="0" cellpadding="6" style="font-size:14px;">
      <tr><td><strong>Session Type:</strong></td><td>${booking.sessionType}${booking.sessionType === 'GROUP' ? ` (${booking.discountPercentage}% group discount)` : ''}</td></tr>
      <tr><td><strong>Curriculum:</strong></td><td>${booking.curriculum}</td></tr>
      <tr><td><strong>Subjects:</strong></td><td>${booking.subjects.join(', ')}</td></tr>
      <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
      <tr><td><strong>Time:</strong></td><td>${booking.timeSlot.startTime} – ${booking.timeSlot.endTime} (${booking.timeSlot.durationMinutes} min)</td></tr>
      <tr><td><strong>Free Trial:</strong></td><td>${booking.isFreeTrialed ? '✅ Yes' : '❌ No'}</td></tr>
      ${booking.notes ? `<tr><td valign="top"><strong>Notes:</strong></td><td>${booking.notes}</td></tr>` : ''}
    </table>

    <div style="margin-top:28px;padding:16px;background:#dbeafe;border-radius:8px;">
      <p style="margin:0;color:#0a2e6f;font-size:14px;">
        <strong>Action required:</strong> Please log in to the admin dashboard to approve or reject this booking.
      </p>
    </div>
  `;
  return wrapper(inner, `New booking from ${booking.parent.fullName}`);
};

const parentConfirmationTemplate = (booking) => {
  const date = new Date(booking.scheduledDate).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const inner = `
    <h2 style="color:#0a2e6f;margin:0 0 12px;">Hello ${booking.parent.fullName.split(' ')[0]} 👋,</h2>
    <p style="font-size:15px;color:#334155;">
      Thank you for booking with <strong>JIV Tutoring Services</strong>. We've received your request and our team
      will reach out within <strong>24 hours</strong> to confirm your session.
    </p>

    <div style="margin:24px 0;background:linear-gradient(135deg,#fef3c7,#fde68a);padding:18px;border-radius:10px;">
      <h3 style="margin:0 0 10px;color:#0a2e6f;">Your Session Summary</h3>
      <table width="100%" cellspacing="0" cellpadding="4" style="font-size:14px;color:#1e293b;">
        <tr><td><strong>Session:</strong></td><td>${booking.sessionType === 'GROUP' ? 'Group' : 'Individual'} ${booking.isFreeTrialed ? '— FREE 45-min trial' : ''}</td></tr>
        <tr><td><strong>Curriculum:</strong></td><td>${booking.curriculum}</td></tr>
        <tr><td><strong>Subjects:</strong></td><td>${booking.subjects.join(', ')}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
        <tr><td><strong>Time:</strong></td><td>${booking.timeSlot.startTime} – ${booking.timeSlot.endTime}</td></tr>
        <tr><td><strong>Booking ID:</strong></td><td><code style="background:#fff;padding:2px 6px;border-radius:4px;">${booking.id}</code></td></tr>
      </table>
    </div>

    <p style="font-size:15px;color:#334155;">
      In the meantime, if you have any questions, simply reply to this email or reach us on
      <a href="https://wa.me/254726555444" style="color:#1e40af;font-weight:600;">WhatsApp</a>.
    </p>

    <p style="font-size:15px;color:#334155;margin-top:24px;">
      Warm regards,<br>
      <strong style="color:#0a2e6f;">The JIV Tutoring Team</strong><br>
      <em style="color:#64748b;">Led by Joan Theresa, Certified Educator</em>
    </p>
  `;
  return wrapper(inner, 'Your JIV Tutoring booking has been received.');
};

const contactMessageTemplate = (data) => {
  const inner = `
    <h2 style="color:#0a2e6f;margin:0 0 16px;">📨 New Contact Message</h2>
    <table width="100%" cellspacing="0" cellpadding="6" style="font-size:14px;">
      <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
      ${data.phone ? `<tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ''}
      <tr><td valign="top"><strong>Message:</strong></td><td>${data.message}</td></tr>
    </table>
  `;
  return wrapper(inner, `Contact message from ${data.name}`);
};

module.exports = {
  adminBookingTemplate,
  parentConfirmationTemplate,
  contactMessageTemplate,
};
