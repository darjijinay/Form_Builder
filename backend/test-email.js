// Test script to verify email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== EMAIL CONFIGURATION TEST ===\n');

console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log();

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

console.log('Testing SMTP connection...\n');

transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP Connection FAILED:');
    console.log(error);
    console.log('\nPossible issues:');
    console.log('1. App Password is incorrect (check for typos)');
    console.log('2. 2-Step Verification not enabled on Gmail');
    console.log('3. App Password was revoked');
    console.log('4. Wrong email address');
  } else {
    console.log('✅ SMTP Connection SUCCESS!');
    console.log('Email service is configured correctly.\n');
    
    // Send test email
    console.log('Sending test email...\n');
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'FormCraft Email Test',
      html: '<h2>Success!</h2><p>Your email configuration is working correctly.</p>',
    }, (err, info) => {
      if (err) {
        console.log('❌ Failed to send test email:', err);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your inbox (and spam folder) for the test email.');
      }
      process.exit(0);
    });
  }
});
