const nodemailer = require('nodemailer');

// Create a transporter with your email service configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // E.g., 'Gmail', 'Outlook', etc.
  auth: {
    user: 'dhirajsonawane4720@gmail.com', // Your email address
    pass: '', // Your email password
  },
});

// Function to send password reset email
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const mailOptions = {
    from: 'dhirajsonawane4720@gmail.com', // Sender's email address
    to: toEmail, // Recipient's email address
    subject: 'Password Reset', // Subject of the email
    text: `Use the following token to reset your password: ${resetToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendPasswordResetEmail };
