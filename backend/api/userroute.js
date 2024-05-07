

const express = require('express');
const router = express.Router();
const db = require('../schemas/users');
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const middleware = require('../middlewares/authMiddleware')



router.post('/register', async (req, res) => {
  try {
      // Check if email already exists
      const emailExists = await new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) AS cnt FROM users WHERE email = ?", req.body.email, (err, data) => {
              if (err) {
                  console.error(err);
                  return reject('Internal Server Error');
              }
              resolve(data[0].cnt > 0);
          });
      });

      if (emailExists) {
          console.log("Email Exists!!!");
          return res.status(409).send('Email already exists');
      }

      // Generate salt
      const salt = await bcrypt.genSalt(10);
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Insert user data
      db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [req.body.name, req.body.email, hashedPassword], (err, insert) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
          }
          res.status(200).json({ message: 'Registration successful' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});






router.post('/login', async (req, res) => {
  try {
      // Check if email exists
      const emailExists = await new Promise((resolve, reject) => {
          db.query("SELECT * FROM users WHERE email = ?", req.body.email, (err, data) => {
              if (err) {
                  console.error(err);
                  return reject('Internal Server Error');
              }
              resolve(data.length > 0 ? data[0] : null);
          });
      });

      // If email doesn't exist, return error
      if (!emailExists) {
          console.log("Email not found!!!");
          return res.status(401).send('Email not found');
      }

      // Extract hashed password from user data
      const hashedPassword = emailExists.password;

      // Extract password string from the array
      const password = req.body.password[0];

      // Check if password matches
      console.log("password:", password);
      console.log("hashedPassword:", hashedPassword);
      const passwordMatches = await bcrypt.compare(password, hashedPassword);

      // If password doesn't match, return error
      if (!passwordMatches) {
          console.log("Password incorrect!!!");
          return res.status(401).send('Password incorrect');
      }
      const token = jwt.sign({ email: req.body.email }, process.env.jwt_secret, { expiresIn: '1d' });

      // If email and password both match, login successful
      console.log("Login successful!!!");
      res.status(200).json({ message: 'Login successful' ,token:token});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});








module.exports = router;








