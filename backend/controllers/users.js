/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const users = require('../db/Users.js');

// class userControllers { 
const signUp = (req, res) => {
  // req.body.id = users.length + 1;
  const newUser = req.body;
  const myPassword = req.body.password;
  bcrypt.hash(myPassword, 10, (err, hash) => {
    // Store hash in database
    if (err) {
      console.log(err);
    } else {
      const hashedPassword = hash;
      console.log(hashedPassword.length, 'rrrrrrr');
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      
      // PG Connect
      // eslint-disable-next-line consistent-return
      pg.query('INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)',
        [newUser.email, newUser.first_name, newUser.last_name, hashedPassword, 
          newUser.address, newUser.is_admin], (err, dbRes) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: 'error encountered',
            });
          } else {
            console.log(dbRes);
            jwt.sign({ newUser }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
              res.status(200).send({
                message: 'Signed up successful',
                token,
              });
            });
          }
          pg.end();
        });
    }
  });
};

const verifyUser = (req, res) => {
  // eslint-disable-next-line max-len
  const newUser = req.body;
  const myPassword = newUser.password;
  const userEmail = newUser.email;
  
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  // PG Connect
  // eslint-disable-next-line consistent-return
  const query = 'SELECT * FROM users WHERE email = $1';
  const value = [userEmail];

  pg.query(query, value, (err, dbres) => {
    console.log(dbres);
    if (err) {
      console.log(err.stack);
      res.status(500).json({
        message: 'error encountered',
      });
    } else if (dbres.rows.length === 0) {
      res.status(500).json({
        message: 'error encountered, Invalid Email',
      });
    } else {
      const dbPsw = dbres.rows[0].password;
      console.log(dbPsw);
      bcrypt.compare(myPassword, dbPsw, (err, match) => {
        if (err) {
          console.log(err.stack);
        } else if (!match) {
          res.status(500).json({
            message: 'error encountered, Invalid password',
          });   
        } else {
          jwt.sign({ newUser }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
            res.status(200).send({
              message: 'Signed in successful',
              token,
            });
          });
        }
      });
    }
  });
};


const protectedRoute = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error',
      });
    } else {
      res.json({
        message: 'Signed in Successfully',
        authData,
      });
    }
  });
};

module.exports = {
  signUp,
  verifyUser,
  protectedRoute,
};

// jwt.sign({ newUser }, secretkey, { expiresIn: '10m' }, (err, token) => {