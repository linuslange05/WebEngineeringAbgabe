// db.js
const sqlite3 = require('sqlite3').verbose();

const path = require('path');

// Der Pfad zur SQLite-Datenbankdatei
const dbPath = path.resolve(__dirname, 'database.db');  // Hier wird die Datenbankdatei erstellt

// Erstelle eine Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Fehler beim Öffnen der Datenbank:', err.message);
  } else {
    console.log('Datenbank erfolgreich verbunden');
  }
});


//Tabelle fpr User erstellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
});

//Tabelle für Messages erstellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      message TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

//Tabelle für Locations erstellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
});

//Tabelle für gespeicherte Locations eines Users erstellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_locations (
      user_id INTEGER,
      location_id INTEGER,
      PRIMARY KEY (user_id, location_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
