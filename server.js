const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new Database('database.db');
console.log('Connected to the SQLite database.');

// Create table if not exists
db.exec(`CREATE TABLE IF NOT EXISTS boarding_passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    dest TEXT,
    date TEXT,
    duration TEXT,
    travelers TEXT,
    msg TEXT,
    img TEXT
)`);

// Root route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Create a new boarding pass
app.post('/api/passes', (req, res) => {
    const { name, dest, date, duration, travelers, msg, img } = req.body;
    
    const sql = `INSERT INTO boarding_passes (name, dest, date, duration, travelers, msg, img)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
                 
    try {
        const stmt = db.prepare(sql);
        const info = stmt.run(name, dest, date, duration, travelers, msg, img);
        res.json({ id: info.lastInsertRowid });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create boarding pass' });
    }
});

// Get a boarding pass by ID
app.get('/api/passes/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM boarding_passes WHERE id = ?`;
    
    try {
        const stmt = db.prepare(sql);
        const row = stmt.get(id);
        if (!row) {
            res.status(404).json({ error: 'Boarding pass not found' });
            return;
        }
        res.json(row);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
