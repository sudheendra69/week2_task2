const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('tasks.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files like index.html

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  category TEXT
)`);

// Get tasks with optional filter
app.get('/tasks', (req, res) => {
  const category = req.query.category;
  let query = "SELECT * FROM tasks";
  let params = [];

  if (category && category !== 'All') {
    query += " WHERE category = ?";
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Add a task
app.post('/tasks', (req, res) => {
  const { text, category } = req.body;
  db.run("INSERT INTO tasks (text, category) VALUES (?, ?)", [text, category], function(err) {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: this.lastID });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});


// for output - node server.js
