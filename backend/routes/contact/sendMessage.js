// routes/register.js
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const express = require("express");
const db = require("../../db/dbController"); // Pfad zur Datenbank
const authMiddleware = require("../../middleware/auth"); // Authentifizierungs-Middleware

const router = express.Router();

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY; // Replace with your reCAPTCHA secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    if (data.success) {
      // reCAPTCHA verification passed
      return true;
    } else {
      // reCAPTCHA verification failed
      return false;
    }
  } catch (error) {
    console.error("reCAPTCHA verification failed", error);
    return false;
  }
};

router.post("/", authMiddleware, async (req, res) => {
  const { name, message, g_recaptcha_token } = req.body;
  const userId = req.userId; // userId vom authMiddleware erhalten
  try {
    console.log(userId);
    // Wenn der User existiert, überpüfe das Google Recaptcha und füge die Message in die messages-Tabelle ein
    if (await verifyRecaptcha(g_recaptcha_token)) {
      db.run(
        `INSERT INTO messages (name, message, user_id) VALUES (?, ?, ?)`,
        [name, message, userId],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Fehler beim Hinzufügen des Message" });
          return res
            .status(201)
            .json({ message: "Message erfolgreich hinzugefügt" });
        }
      );
    } else {
      return res
        .status(404)
        .json({ error: "Google Recaptcha nicht bestanden" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
