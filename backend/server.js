// server.js
const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db/dbController');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const registerRoute = require('./routes/auth/register'); // Importiere die Register-Route
const loginRoute = require('./routes/auth/login');       // Importiere die Login-Route
const isLoggedInRoute = require('./routes/auth/isLoggedIn');
const logoutRoute = require('./routes/auth/logout');

const getEmailRoute = require('./routes/users/getEmail');

const saveLocationRoute = require('./routes/locations/saveLocation');
const removeLocationRoute = require('./routes/locations/removeLocation');
const getLocationsRoute = require('./routes/locations/getLocations');
const isLocationSavedRoute = require('./routes/locations/isLocationSaved');

const sendMessageRoute = require('./routes/contact/sendMessage');

const app = express();
dotenv.config({ path: '.env.local' });

const PORT = process.env.BACKEND_PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',  // React-App URL
  credentials: true,
}));




app.get('/', (req, res)=>{
    res.send('Are you really trying to debug my backend server rn?');
})

// Routen einbinden
app.use('/auth/register', registerRoute);  // Register-Route verfügbar unter /auth/register
app.use('/auth/login', loginRoute);        // Login-Route verfügbar unter /auth/login
app.use('/auth/isLoggedIn', isLoggedInRoute);
app.use('/auth/logout', logoutRoute);

app.use('/users/email', getEmailRoute);

app.use('/locations/save', saveLocationRoute);
app.use('/locations/remove', removeLocationRoute);
app.use('/locations/all', getLocationsRoute);
app.use('/locations/isLocationSaved', isLocationSavedRoute);

app.use('/contact/sendMessage', sendMessageRoute);


app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});