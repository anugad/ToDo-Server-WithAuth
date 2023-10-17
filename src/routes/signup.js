const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/userModel');

router.post('/', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate the role
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role provided' });
        }

        // Check for existing user
        db.getUserByUsername(username, (err, results) => {
            if (err) {
                console.error('Error checking user: ' + err);
                return res.status(500).json({ success: false, message: 'Error checking user' });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }

            // If no existing user, continue with registration
            const hashedPassword = bcrypt.hashSync(password, 10);
            const userData = { username, password: hashedPassword, role };

            db.createUser(userData, (err, result) => {
                if (err) {
                    console.error('Error registering user: ' + err);
                    return res.status(500).json({ success: false, message: 'Error registering user' });
                }
                res.status(200).json({ success: true, message: 'User registered successfully' });
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
