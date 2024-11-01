// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt')


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // replace with your MySQL username
    password: 'Vaisag@2004', // replace with your MySQL password
    database: 'InternshipPortal'             // name of the database as per finaldatabase.sql
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
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
            console.log(password);
            const match = await bcrypt.compare(password,user.Password);
            if(match){
            res.json({
                message:`${userType}.charAt(0).toUpperCase()+ userType.slice(1)} login successful`
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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
