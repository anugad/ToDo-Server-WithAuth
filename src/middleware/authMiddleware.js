const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

function authMiddleware(req, res, next) {
  const token = req.header('authorization');

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Assign the decoded token payload to req.user, so you can access it in routes
    req.user = decoded.user;

    next(); // Move to the next middleware/route handler
  } catch (err) {
    console.error('Something wrong with auth middleware', err);
    res.status(401).json({ success: false, message: 'Token is not valid' }); // Change 500 to 401 and provide a more relevant message
  }
}

module.exports = authMiddleware;
