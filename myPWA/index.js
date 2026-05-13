// Basic PWA server
const express = require('express');
const path = require('path');

const app = express();

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to SPA entry
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Basic PWA server running at http://localhost:${PORT}`);
});
