const express = require("express");
const router = express.Router();
const db = require("../schemas/users");
router.post('/add', async (req, res) => {
  try {
      // Insert movie details into the movies table
      const movieInsertResult = await new Promise((resolve, reject) => {
          db.query("INSERT INTO movies (poster, title, plot,producers, date) VALUES (?, ?, ?, ?,?)", [req.body.poster, req.body.title, req.body.plot,req.body.producers, req.body.date], (err, result) => {
              if (err) {
                  console.error(err);
                  return reject('Internal Server Error');
              }
              resolve(result);
          });
      });

      // Insert associations between movie and actors into the junction table
      const actorsInsertResult = await Promise.all(req.body.actors.map(actorId => {
          return new Promise((resolve, reject) => {
              db.query("INSERT INTO movie_actors (movie_id, actor_id) VALUES (?, ?)", [movieInsertResult.insertId, actorId], (err, result) => {
                  if (err) {
                      console.error(err);
                      return reject('Internal Server Error');
                  }
                  resolve(result);
              });
          });
      }));

      res.status(200).json({ message: 'Movie added successfully', movieId: movieInsertResult.insertId });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});




// GET route to fetch all movie details along with producer and actors
router.get('/all', async (req, res) => {
  try {
    // Fetch all movie details along with producer and actors using JOIN
    const movies = await new Promise((resolve, reject) => {
      db.query(`
        SELECT 
  m.*, 
  p.name, 
  GROUP_CONCAT(a.name) AS actor_names 
FROM 
  movies m
LEFT JOIN 
  producers p ON m.producers = p.id
LEFT JOIN 
  movie_actors ma ON m.id = ma.movie_id
LEFT JOIN 
  actors a ON ma.actor_id = a.id
GROUP BY 
  m.id;

        `, (err, result) => {
          if (err) {
            console.error(err);
            return reject('Internal Server Error');
          }
          resolve(result);
        });
    });

    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;









