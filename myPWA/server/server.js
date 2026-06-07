const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err);
  }
});

db.serialize(() => { // Create users table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

function sendServerError(res, err) { // Helper function to send a 500 Internal Server Error response
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}

router.use(express.json());

router.post('/signup', (req, res) => { // Handle user signup
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => { // Check if username already exists
    if (err) return sendServerError(res, err);
    if (row) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)', // Insert new user into database
      [username, password],
      function (insertErr) {
        if (insertErr) return sendServerError(res, insertErr);
        return res.status(201).json({ message: 'User registered successfully.' });
      }
    );
  });
});

router.post('/login', (req, res) => { // Handle user login
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' }); 
  }

  db.get(
    'SELECT id, username, password, role FROM users WHERE username = ?', // Check if user exists and password matches
    [username],
    (err, user) => {
      if (err) return sendServerError(res, err);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password.' }); // Return 401 Unauthorized if credentials are invalid
      }

      return res.json({ message: 'Login successful.' });
    }
  );
});

module.exports = router;
