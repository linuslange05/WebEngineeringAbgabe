// routes/login.js
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

  res.clearCookie('token');
  res.status(200).json({ message: 'Logout erfolgreich' });
});

module.exports = router;
