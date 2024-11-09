// routes/locations/location.js
const express = require('express');
const db = require('../../db/dbController');
const authMiddleware = require('../../middleware/auth'); // Authentifizierungs-Middleware
const router = express.Router();

router.delete('/', authMiddleware, (req, res) => {
    const { name } = req.body;
    const userId = req.userId; // userId vom authMiddleware erhalten
  
    // Überprüfen, ob die Location existiert
    db.get(
      `SELECT id FROM locations WHERE name = ?`,
      [name],
      (err, location) => {
        if (err) return res.status(500).json({ error: 'Fehler beim Abrufen der Location' });
  
        if (!location) {
          return res.status(404).json({ error: 'Location nicht gefunden' });
        }
  
        // Überprüfen, ob der Benutzer die Location gespeichert hat
        db.run(
          `DELETE FROM user_locations WHERE user_id = ? AND location_id = ?`,
          [userId, location.id],
          (err) => {
            if (err) return res.status(500).json({ error: 'Fehler beim Löschen der Location' });
            return res.status(200).json({ message: 'Location erfolgreich gelöscht' });
          }
        );
      }
    );
  });

module.exports = router;
