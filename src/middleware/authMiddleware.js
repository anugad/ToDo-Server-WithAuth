const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

function authMiddleware(req, res, next) {
  const token = req.header('authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // To verify the token
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;

    next();
  } catch (err) {
    console.error('Something wrong with auth middleware', err);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
