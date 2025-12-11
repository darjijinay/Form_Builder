// server/src/services/emailService.js
const nodemailer = require('nodemailer');

// Initialize transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

/**
 * Send notification email when form is submitted
 * @param {string} notificationEmail - Email to send to
 * @param {Object} form - Form object with title, fields
 * @param {Array} answers - Array of {fieldId, value} pairs
 */
exports.sendResponseNotification = async (notificationEmail, form, answers) => {
  console.log('=== EMAIL NOTIFICATION DEBUG ===');
  console.log('Recipient:', notificationEmail);
  console.log('EMAIL_USER configured:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASS configured:', !!process.env.EMAIL_PASS);
  console.log('Form title:', form.title);
  
  if (!notificationEmail || !process.env.EMAIL_USER) {
    console.log('❌ Email notification skipped: no recipient or credentials');
    return;
  }

  try {
    // Build response body
    const fieldMap = {};
    form.fields.forEach((f) => {
      fieldMap[f._id] = f.label;
    });

    const responseBody = answers
      .map((ans) => {
        const label = fieldMap[ans.fieldId] || ans.fieldId;
        const value = Array.isArray(ans.value) ? ans.value.join(', ') : ans.value;
        return `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${label}</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td></tr>`;
      })
      .join('');

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>${form.title} - New Response</h2>
          <p>A new response has been submitted to your form.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Field</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Response</th>
              </tr>
            </thead>
            <tbody>
              ${responseBody}
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This is an automated notification from FormCraft.
          </p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `New Response: ${form.title}`,
      html: htmlContent,
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    console.error('Full error:', err);
    // Don't throw - don't block form submission if email fails
  }
};
