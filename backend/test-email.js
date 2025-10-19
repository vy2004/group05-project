// Test script để kiểm tra gửi email
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : 'undefined');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

async function testEmail() {
  try {
    console.log('📧 Creating transporter...');
    const transporter = createTransporter();
    
    console.log('📤 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'sangdo742@gmail.com',
      subject: 'Test Email from Group05',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
