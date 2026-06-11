const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if admin exists
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create JWT Payload
        const payload = {
            admin: {
                id: admin.id,
                username: admin.username
            }
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '10h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, username: admin.username });
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
