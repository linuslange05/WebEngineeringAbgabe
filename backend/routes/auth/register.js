// routes/register.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db/dbController');  // Pfad zur Datenbank

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Benutzer konnte nicht erstellt werden' });
      }
      const userId = this.lastID;
      // JWT erzeugen
      const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: true });
      res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;