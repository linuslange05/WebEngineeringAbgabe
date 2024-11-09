// routes/login.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db/dbController');  // Pfad zur Datenbank

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Benutzer nicht gefunden' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Ungültiges Passwort' });

    // JWT erzeugen
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({ message: 'Login erfolgreich' });
  });
});

module.exports = router;
