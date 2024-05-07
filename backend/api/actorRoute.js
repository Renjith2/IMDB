

const express = require("express");
const router = express.Router();
const db = require("../schemas/users");

router.post('/add', async (req, res) => {
    try {
        // Check if producer already exists
        const producerExists = await new Promise((resolve, reject) => {
            db.query("SELECT COUNT(*) AS cnt FROM actors WHERE name = ?", [req.body.name], (err, data) => {
                if (err) {
                    console.error(err);
                    return reject('Internal Server Error');
                }
                resolve(data[0].cnt > 0);
            });
        });
  
        if (producerExists) {
            console.log("Actor already exists!");
            return res.status(409).send('Actor already exists');
        }
  
        // Format the date to 'DD-MM-YYYY' format
        const formattedDate = new Date(req.body.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).split('/').reverse().join('-');

        // Insert producer data with formatted date
        db.query(
            'INSERT INTO actors (name, gender, bio, dateofbirth) VALUES (?, ?, ?, ?)', 
            [req.body.name, req.body.gender, req.body.bio, formattedDate], 
            (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
           console.log(result)
            res.status(200).json({ message: 'Actor added successfully', data: { id: result.insertId, ...req.body} });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET endpoint to retrieve all actors
router.get('/all', (req, res) => {
    // SQL query to select all actors from the actors table
    const sql = 'SELECT * FROM actors';
  
    // Execute the SQL query
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving actors: ' + err.stack);
        res.status(500).send('Error retrieving actors from the database');
        return;
      }
  
      // Send the results back as a JSON response
      res.json(results);
    });
  });
  

module.exports = router;