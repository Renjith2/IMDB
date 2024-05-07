

const express = require("express");
const router = express.Router();
const db = require("../schemas/users");

router.post('/add', async (req, res) => {
    try {
        // Check if producer already exists
        const producerExists = await new Promise((resolve, reject) => {
            db.query("SELECT COUNT(*) AS cnt FROM producers WHERE name = ?", [req.body.name], (err, data) => {
                if (err) {
                    console.error(err);
                    return reject('Internal Server Error');
                }
                resolve(data[0].cnt > 0);
            });
        });
  
        if (producerExists) {
            console.log("Producer already exists!");
            return res.status(409).send('Producer already exists');
        }
  
        // Format the date to 'DD-MM-YYYY' format
        const formattedDate = new Date(req.body.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).split('/').reverse().join('-');

        // Insert producer data with formatted date
        db.query('INSERT INTO producers (name, gender, bio, dateofbirth) VALUES (?, ?, ?, ?)', [req.body.name, req.body.gender, req.body.bio, formattedDate], (err, insert) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json({ message: 'Producer added successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/all', async (req, res) => {
    try {
        // Retrieve all producers' information
        db.query('SELECT * FROM producers', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json(data); // Send the retrieved data as JSON response
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


module.exports = router;
