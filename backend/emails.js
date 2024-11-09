import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();  // Make sure to load environment variables

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your Gmail App Password
  },
  logger: true,  // Enable logging for debugging
  debug: true,   // Logs SMTP transactions
  secure: false, // Use TLS (SMTP over port 587)
  port: 587,     // Default for TLS
  tls: {
    rejectUnauthorized: false, // Disable SSL certificate validation (for testing)
  },
});

// Function to send email verification email
export const sendVerificationEmail = (email, verificationToken) => {
  const url = `${process.env.BASE_URL}/verify/${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    text: `Click the link to verify your email: ${url}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Function to send password reset email
export const sendPasswordResetEmail = (email, resetToken) => {
  const url = `${process.env.BASE_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    text: `Click the link to reset your password: ${url}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset email:', error);
    } else {
      console.log('Password reset email sent:', info.response);
    }
  });
};