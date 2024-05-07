const mysql=require('mysql')
require('dotenv').config()

const db= mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password:process.env.passwordname,
    database:process.env.databasename
  })
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!!');
  });

  module.exports = db;
