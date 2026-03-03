const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// @route   POST api/auth/send-otp
// @desc    Send dummy OTP and check if user exists
router.post('/send-otp', async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: 'Identifier is required' });

    try {
        const isEmail = identifier.includes('@');
        const query = isEmail 
            ? 'SELECT id FROM users WHERE email = $1' 
            : 'SELECT id FROM users WHERE phone = $1';
        
        const result = await pool.query(query, [identifier]);
        
        res.json({ 
            exists: result.rows.length > 0,
            message: 'OTP sent successfully (Dummy: 123456)' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP (Fixed 123456)
router.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    if (otp !== '123456') {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    res.json({ message: 'OTP verified' });
});

// @route   POST api/auth/login
// @desc    Login user with password
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    
    try {
        const isEmail = identifier.includes('@');
        const query = isEmail 
            ? 'SELECT * FROM users WHERE email = $1' 
            : 'SELECT * FROM users WHERE phone = $1';
        
        const result = await pool.query(query, [identifier]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/register
// @desc    Complete profile and register user with password
router.post('/register', async (req, res) => {
    const { identifier, firstName, lastName, password } = req.body;
    const isEmail = identifier.includes('@');

    try {
        // Check if user exists
        const checkQuery = isEmail 
            ? 'SELECT id FROM users WHERE email = $1' 
            : 'SELECT id FROM users WHERE phone = $1';
        const exists = await pool.query(checkQuery, [identifier]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const query = isEmail 
            ? 'INSERT INTO users (email, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *'
            : 'INSERT INTO users (phone, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
        
        const result = await pool.query(query, [identifier, firstName, lastName || '', passwordHash]);
        const user = result.rows[0];

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
