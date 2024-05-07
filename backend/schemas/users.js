const mysql=require('mysql')
require('dotenv').config()

const db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"HalaMadrid@1",
    database:'imdb'
  })
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  module.exports = db;
