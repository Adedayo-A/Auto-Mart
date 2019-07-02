/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

// const users = require('../db/Users.js');
// class userControllers { 
const signUp = (req, res) => {
  const user = req.body;
  const myPassword = user.password;
  bcrypt.hash(myPassword, 10, (err, hash) => {
    // Store hash in database
    if (err) {
      console.log(err);
    } else {
      const hashedPassword = hash;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      const query = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)';
      const value = [user.email, user.first_name, user.last_name, hashedPassword, 
        user.address, user.is_admin];
      
      // PG Connect
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbRes) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: 'error encountered',
          });
        } else {
          console.log(dbRes);
          jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '30m' }, (err, token) => {
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
  const user = req.body;
  const myPassword = user.password;
  const userEmail = user.email;
  
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  // PG Connect
  // eslint-disable-next-line consistent-return
  const query = 'SELECT * FROM users WHERE email = $1';
  const value = [userEmail];
 

  pg.query(query, value, (err, dbres) => {
    if (err) {
      console.log(err.stack);
      res.status(500).json({
        message: 'error encountered',
      });
    } else if (dbres.rows.length === 0) {
      res.status(403).json({
        message: 'error encountered, Invalid Email',
      });
    } else {
      const dbPsw = dbres.rows[0].password;
      const username = dbres.rows[0].first_name;
      bcrypt.compare(myPassword, dbPsw, (err, match) => {
        if (err) {
          console.log(err.stack);
        } else if (!match) {
          res.status(403).json({
            message: 'error encountered, Invalid password',
          });   
        } else {
          jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '30m' }, (err, token) => {
            res.status(200).send({
              message: `Welcome Back ${username}`,
              token,
            });
          });
          pg.end();
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
