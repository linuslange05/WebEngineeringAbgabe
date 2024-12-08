// routes/locations/location.js
const express = require('express');
const db = require('../../db/dbController');
const authMiddleware = require('../../middleware/auth'); // Authentifizierungs-Middleware
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const userId = req.userId; // userId vom authMiddleware erhalten
  
    // Alle Locations des Benutzers abfragen
    db.all(
      `SELECT locations.id, locations.name, locations.latitude, locations.longitude
       FROM locations
       JOIN user_locations ON locations.id = user_locations.location_id
       WHERE user_locations.user_id = ?`,
      [userId],
      (err, locations) => {
        if (err) return res.status(500).json({ error: 'Fehler beim Abrufen der Locations' });
  
        return res.status(200).json(locations);
      }
    );
  });

module.exports = router;
