// routes/locations/location.js
const express = require('express');
const db = require('../../db/dbController');
const authMiddleware = require('../../middleware/auth'); // Authentifizierungs-Middleware
const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
    const { name } = req.body;
    const userId = req.userId; // userId vom authMiddleware erhalten
  
    // Überprüfen, ob die Location bereits in der locations-Tabelle existiert
    db.get(
      `SELECT id FROM locations WHERE name = ?`,
      [name],
      (err, location) => {
        if (err) return res.status(500).json({ error: 'Fehler beim Überprüfen der Location' });
  
        if (location) {
          // Wenn die Location bereits existiert, füge sie zu den user_locations hinzu
          db.run(
            `INSERT OR IGNORE INTO user_locations (user_id, location_id) VALUES (?, ?)`,
            [userId, location.id],
            (err) => {
              if (err) return res.status(500).json({ error: 'Fehler beim Hinzufügen der Location' });
              return res.status(201).json({ message: 'Location erfolgreich hinzugefügt' });
            }
          );
        } else {
          // Wenn die Location nicht existiert, füge sie in die locations-Tabelle ein und dann zur user_locations
          db.run(
            `INSERT INTO locations (name) VALUES (?)`,
            [name],
            function (err) {
              if (err) return res.status(500).json({ error: 'Fehler beim Hinzufügen der Location' });
  
              const locationId = this.lastID; // ID der neu hinzugefügten Location
  
              // Location zu den user_locations des Benutzers hinzufügen
              db.run(
                `INSERT INTO user_locations (user_id, location_id) VALUES (?, ?)`,
                [userId, locationId],
                (err) => {
                  if (err) return res.status(500).json({ error: 'Fehler beim Hinzufügen der Location zu user_locations' });
                  return res.status(201).json({ message: 'Location erfolgreich hinzugefügt' });
                }
              );
            }
          );
        }
      }
    );
  });

module.exports = router;
