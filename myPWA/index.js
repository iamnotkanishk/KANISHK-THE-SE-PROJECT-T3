// Basic PWA server
const express = require('express');
const path = require('path');
const authRoutes = require('./server/server');

const app = express();
app.use(express.json());

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(authRoutes);

// Fallback to SPA entry
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Basic PWA server running at http://localhost:${PORT}`);
});
