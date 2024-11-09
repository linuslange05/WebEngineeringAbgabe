// routes/locations/location.js
const express = require('express');
const db = require('../../db/dbController');
const authMiddleware = require('../../middleware/auth'); // Authentifizierungs-Middleware
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const userId = req.userId; // userId vom authMiddleware erhalten
  
    // Alle Locations des Benutzers abfragen
    db.get(
      `SELECT email FROM users WHERE id = ?`,
      [userId],
      (err, email) => {
        if (err) return res.status(500).json({ error: 'Fehler beim Abrufen der Email' });
  
        return res.status(200).json(email);
      }
    );
  });

module.exports = router;
