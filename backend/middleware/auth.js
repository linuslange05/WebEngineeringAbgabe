const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

module.exports = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Ungültiges Token' });
    }

    req.userId = decoded.userId; // `userId` aus dem Token extrahieren
    next();
  });
};