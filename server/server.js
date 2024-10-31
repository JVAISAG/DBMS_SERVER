// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user',       // replace with your MySQL username
    password: 'your_mysql_password', // replace with your MySQL password
    database: 'finalsql'             // name of the database as per finaldatabase.sql
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Login route
app.post('/api/login', (req, res) => {
    const { username, pass } = req.body;

    // Query to check if user exists and password matches
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, pass], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
