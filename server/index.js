// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();
const port =  5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// db.js

require('dotenv').config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vaisag@2004",
  database: "InternshipPortal",
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
app.post("/api/register", (req, res) => {
  const { EmailID, PhoneNo, PinCode, Password, FirstName, LastName, DOB } = req.body;
  console.log("connected");
  console.log(req.body)
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


// Login route
app.post("/api/login", (req, res) => {
  const { email, password,userType } = req.body;
  console.log("Received data:", { email, password, userType });

  let table,emailField
  if(userType === "student"){
      table= "STUDENTS"
      emailField="EmailID"        
  }
  else if(userType === "company"){
      table = "COMPANY"
      emailField="CompanyName"
  }
  else{
      return res.status(400).json({message: "Invalid user type"})

  }
  const query = `SELECT * FROM ${table} WHERE ${emailField} = ?`;
  db.query(query,[email] ,async (err,results)=>{
      if(err){
          console.error("Eroor executing query",err)
          return res.status(500).json({message:'Internal server error'})
      }
      
      if(results.length>0){
          const user = results[0];
          console.log(password , user.Password);
          const match = password.localeCompare(user.Password);
          console.log(match)
          if(match == 0){
          res.json({
              message:`${userType.charAt(0).toUpperCase()+ userType.slice(1)} login successful`
          })
          }
          else{
              res.status(401).json({message:`Invalid credentials`})
          }
      
      }
      else{
          res.status(404).json({ message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` })
      }
      

      
  })
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
