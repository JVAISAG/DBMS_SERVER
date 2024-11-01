// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port =  process.env.PORT||5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// db.js
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;


// Registration endpoint
app.post("/api/resgister", (req, res) => {
  const { EmailID, PhoneNo, PinCode, Password, FirstName, LastName, DOB } = req.body;
  console.log("connected");
  const query = 'INSERT INTO STUDENTS (EmailID, PhoneNo, PinCode, Password, FirstName, LastName, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [EmailID, PhoneNo, PinCode, Password, FirstName, LastName, DOB];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error registering user' });
    }
    return res.status(201).json({ message: 'User registered successfully', StudentID: results.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
