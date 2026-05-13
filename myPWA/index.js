// myPWA/index.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
// Initialize Express app and SQLite DB
const app = express();
const DB_PATH = path.join(__dirname, '.database', 'datasource.db');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('Failed to open DB:', err.message);
  else console.log('Opened DB at', DB_PATH);
});

// Parse JSON bodies
app.use(express.json());

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Seed DB on start
let seedSQL = null;
try {
  seedSQL = fs.readFileSync(path.join(__dirname, '.database', 'myQuery.sql'), 'utf8');
} catch (err) {
  console.warn('No seed SQL found — skipping seed.');
}
// Start server
function startServer() {
  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
// Seed the database if seed SQL is available
if (seedSQL) {
  db.exec(seedSQL, (err) => {
    if (err) {
      console.error('Error seeding DB:', err.message);
      process.exit(1);
    }
    console.log('Database ready.');
    startServer();
  });
} else {
  startServer();
}

// GET /api/recipes?query=&cuisine=
app.get('/api/recipes', (req, res) => {
  const { query = '', cuisine = '' } = req.query;

  const q = `%${String(query).toLowerCase()}%`;
  const c = `%${String(cuisine).toLowerCase()}%`;

  // Title/tags/ingredient/cuisine match, then filter by cuisine if provided
  const sql = `
    SELECT DISTINCT id, title, cuisine, tags, ingredients, instructions, image
    FROM recipes
    WHERE LOWER(title) LIKE ?
       OR LOWER(tags) LIKE ?
       OR LOWER(ingredients) LIKE ?
       OR LOWER(cuisine) LIKE ?
  `;

  const applyCuisine = cuisine.trim().length > 0; // whether to filter by cuisine
  
  // Execute query
  db.all(sql, [q, q, q, q], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(`API /recipes: query="${query}", cuisine="${cuisine}", rows=${rows.length}`);
    const filtered = applyCuisine
      ? rows.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()))
      : rows;
    console.log(`Filtered: ${filtered.length}`);
    res.json(filtered);
  });
});

// Fallback to SPA entry
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
