const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDb = require('../models/userModel'); // Import the userModel.js

const { jwtSecret } = require('../config/secrets');

// User sign-in
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve user from the db
    userDb.getUserByUsername(username, async (err, results) => {
      if (err) {
        console.error('Error signing in: ' + err);
        return res.status(500).json({ success: false, message: 'Error signing in' });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const hashedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

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
