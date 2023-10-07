const jwt = require('jsonwebtoken');
const secretKey = 'accessKey'; // Replace with your actual secret key
const User = require('../models/user.model'); // Import your User model
const invalidatedTokens = [];

const authenticateJWT = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];

      // Check if the token has been invalidated
      if (invalidatedTokens.includes(token)) {
        return res.status(401).json({ status: 'failed', message: 'Token is invalid' });
      }

      const { userId } = jwt.verify(token, secretKey);

      // Fetch the user from the database based on the decoded user ID
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(401).json({ status: 'failed', message: 'User not found' });
      }

      // Attach the user object to the request for use in route handlers
      req.user = user;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({ status: 'failed', message: 'Token is invalid' });
    }
  } else {
    res.status(401).json({ status: 'failed', message: 'Unauthorized user, No token found' });
  }
};

module.exports = authenticateJWT;
