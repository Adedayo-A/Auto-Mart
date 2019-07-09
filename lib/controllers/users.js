/* eslint-disable no-trailing-spaces */

/* eslint-disable eol-last */

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const {
  Client
} = require('pg');

const jwt = require('jsonwebtoken'); // eslint-disable-next-line import/no-extraneous-dependencies


const bcrypt = require('bcrypt'); // const users = require('../db/Users.js');
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
        connectionString: process.env.db_URL
      });
      pg.connect();
      const query = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)';
      const value = [user.email, user.first_name, user.last_name, hashedPassword, user.address, user.is_admin]; // PG Connect
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, (err, dbRes) => {
        if (err) {
          if (err.constraint === 'users_email_key') {
            res.status(500).json({
              message: 'email already exist, please choose another email'
            });
            pg.end();
          } else if (err) {
            console.log(err);
            res.status(500).json({
              message: 'error encountered'
            });
            pg.end();
          }
        } else {
          jwt.sign({
            user
          }, process.env.JWT_KEY, {
            expiresIn: '30m'
          }, (err, token) => {
            res.status(200).send({
              message: 'Sucess..sign up successful',
              token
            });
            pg.end();
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
    connectionString: process.env.db_URL
  });
  pg.connect(); // PG Connect
  // eslint-disable-next-line consistent-return

  const query = 'SELECT * FROM users WHERE email = $1';
  const value = [userEmail];
  pg.query(query, value, (err, dbres) => {
    if (err) {
      console.log(err.stack);
      res.status(500).json({
        message: 'error encountered'
      });
      pg.end();
    } else if (dbres.rows.length === 0) {
      res.status(403).json({
        message: 'error encountered, Invalid Email'
      });
      pg.end();
    } else {
      const dbPsw = dbres.rows[0].password;
      const username = dbres.rows[0].first_name;
      bcrypt.compare(myPassword, dbPsw, (err, match) => {
        if (err) {
          console.log(err.stack);
          pg.end();
        } else if (!match) {
          res.status(403).json({
            message: 'error encountered, Invalid password'
          });
          pg.end();
        } else {
          jwt.sign({
            user
          }, process.env.JWT_KEY, {
            expiresIn: '30m'
          }, (err, token) => {
            res.status(200).json({
              username: username,
              status: 200,
              message: `Success..Welcome Back ${username}`,
              token
            });
          });
          pg.end();
        }
      });
    }
  });
}; // UPDATE A USER


const updateUser = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    // eslint-disable-next-line prefer-destructuring
    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      // eslint-disable-next-line prefer-destructuring
      const email = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      const query = 'UPDATE users SET first_name=$1, last_name=$2, address=$3 WHERE email = $4';
      const value = [req.body.first_name, req.body.last_name, req.body.address, email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
        } else if (dbres.rowCount === 0) {
          console.log(dbres);
          res.status(403).json({
            message: 'An error occured, please check input'
          });
        } else {
          res.status(200).json({
            message: 'Profile updated'
          });
        }

        pg.end();
      });
    }
  });
};

module.exports = {
  signUp,
  verifyUser,
  updateUser
};