const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

// Ensure logs directory exists
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  fs.appendFileSync('./logs/requests.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`);
  next();
});

const dbConfig = {
  host: 'mysql-db',
  user: 'myuser',
  password: 'myuserpass',
  database: 'mydb',
  port: 3306,
};

function connectWithRetry() {
  const db = mysql.createConnection(dbConfig);

  db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL, retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected to MySQL');
      setupRoutes(db);
    }
  });
}

function setupRoutes(db) {
  app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) return res.status(500).send('Error fetching users');
      res.json(results);
    });
  });

  app.post('/users', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO users (name) VALUES (?)', [name], (err) => {
      if (err) return res.status(500).send('Error adding user');
      res.status(201).send('User added');
    });
  });
  // backend/index.js
 app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('User deleted');
   });
 });

  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}

connectWithRetry();
