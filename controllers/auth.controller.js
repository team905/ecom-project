const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/email.service');
const { token } = require('morgan');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Login failed: User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Login failed: Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, 'accessKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token: `Bearer ${token}`, user:user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const logout = (req, res) => {
  const { authorization } = req.headers;
  token = authorization.split(' ')[1];


  if (!token) {
    return res.status(400).json({ message: 'Token not provided' });
  }

  invalidatedTokens.push(token);
  res.status(200).json({ message: 'Logout successful' });
};

const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;

    const resetToken = crypto.randomBytes(20).toString('hex');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    // await sendPasswordResetEmail(email, resetToken);
    console.log(resetToken)
    res.status(200).json({ message: 'Password reset token sent to your email', resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const response = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const { email_verified, email, name, picture } = response.payload;

    if (email_verified) {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, email, name, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
      } else {
        let password = email + process.env.JWT_SECRET;
        const newUser = new User({ name, email, password });
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, email, name, role } = newUser;
        return res.json({ token, user: { _id, email, name, role } });
      }
    } else {
      return res.status(400).json({ error: 'Google login failed. Try again.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = { login, logout, forgetPass, resetPassword }
