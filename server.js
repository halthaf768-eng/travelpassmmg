const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if not exists
        db.run(`CREATE TABLE IF NOT EXISTS boarding_passes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            dest TEXT,
            date TEXT,
            duration TEXT,
            travelers TEXT,
            msg TEXT,
            img TEXT
        )`);
    }
});

// Create a new boarding pass
app.post('/api/passes', (req, res) => {
    const { name, dest, date, duration, travelers, msg, img } = req.body;
    
    const sql = `INSERT INTO boarding_passes (name, dest, date, duration, travelers, msg, img)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
                 
    db.run(sql, [name, dest, date, duration, travelers, msg, img], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to create boarding pass' });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Get a boarding pass by ID
app.get('/api/passes/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM boarding_passes WHERE id = ?`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Boarding pass not found' });
            return;
        }
        res.json(row);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
