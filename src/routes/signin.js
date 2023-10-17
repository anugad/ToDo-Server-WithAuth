const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDb = require('../models/userModel'); // Import the userModel.js

// Require the JWT secret key from the secrets.js file
const { jwtSecret } = require('../config/secrets');

// Handle user sign-in
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve user from the database using userModel.js
    userDb.getUserByUsername(username, async (err, results) => {
      if (err) {
        console.error('Error signing in: ' + err);
        return res.status(500).json({ success: false, message: 'Error signing in' });
      }

      // Check if user exists
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Verify password using bcrypt
      const hashedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate JWT token with user role
      const token = jwt.sign(
        { user: { id: results[0].id, username: results[0].username, role: results[0].role } },
        jwtSecret, // Secret key
        { expiresIn: '1h' }
      );

      res.status(200).json({ success: true, token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
