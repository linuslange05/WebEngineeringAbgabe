const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db/dbController');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const router = express.Router();

router.get('/', async (req, res) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided', loggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await db.get('SELECT id, email FROM users WHERE id = ?', [decoded.userId]);

        if (!user) {
            return res.status(401).json({ message: 'User not found', loggedIn: false });
        }

        res.status(200).json({ message: 'User is logged in', loggedIn: true, user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', loggedIn: false });
    }
});

module.exports = router;