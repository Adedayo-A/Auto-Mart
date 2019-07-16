"use strict";

/* eslint-disable no-trailing-spaces */

/* eslint-disable eol-last */

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var _require = require('pg'),
    Client = _require.Client;

var jwt = require('jsonwebtoken'); // eslint-disable-next-line import/no-extraneous-dependencies


var bcrypt = require('bcrypt'); // const users = require('../db/Users.js');
// class userControllers { 


var signUp = function signUp(req, res) {
  var user = req.body;
  var myPassword = user.password;
  bcrypt.hash(myPassword, 10, function (err, hash) {
    // Store hash in database
    if (err) {
      console.log(err);
    } else {
      var hashedPassword = hash;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)';
      var value = [user.email, user.first_name, user.last_name, hashedPassword, user.address, user.is_admin]; // PG Connect
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, function (err, dbRes) {
        if (err) {
          if (err.constraint === 'users_email_key') {
            console.log(err);
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
            user: user
          }, process.env.JWT_KEY, {
            expiresIn: '20m'
          }, function (err, token) {
            query = 'SELECT * FROM users WHERE email = $1';
            value = [user.email];
            pg.query(query, value, function (err, dbres) {
              if (err) {
                console.log(err.stack);
                res.status(500).json({
                  message: 'error encountered'
                });
                pg.end();
              } else {
                var username = dbres.rows[0].first_name;

                if (username === null) {
                  username = 'user';
                }

                res.status(200).send({
                  username: username,
                  state: 'success',
                  status: 200,
                  message: 'Sign up successful',
                  token: token
                });
                pg.end();
              }
            });
          });
        }
      });
    }
  });
};

var verifyUser = function verifyUser(req, res) {
  // eslint-disable-next-line max-len
  var user = req.body;
  var myPassword = user.password;
  var userEmail = user.email;
  var pg = new Client({
    connectionString: process.env.db_URL
  });
  pg.connect(); // PG Connect
  // eslint-disable-next-line consistent-return

  var query = 'SELECT * FROM users WHERE email = $1';
  var value = [userEmail];
  pg.query(query, value, function (err, dbres) {
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
      var dbPsw = dbres.rows[0].password;
      var username = dbres.rows[0].first_name;
      var admin = dbres.rows[0].is_admin;

      if (username === null) {
        username = 'user';
      }

      bcrypt.compare(myPassword, dbPsw, function (err, match) {
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
            user: user
          }, process.env.JWT_KEY, {
            expiresIn: '20m'
          }, function (err, token) {
            res.status(200).json({
              username: username,
              admin: admin,
              status: 200,
              message: "Success..Welcome Back ".concat(username),
              token: token
            });
          });
          pg.end();
        }
      });
    }
  });
}; // UPDATE A USER


var updateUser = function updateUser(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    // eslint-disable-next-line prefer-destructuring    
    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      // eslint-disable-next-line prefer-destructuring
      var token = req.token;
      var email = authData.user.email;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'UPDATE users SET first_name=$1, last_name=$2, address=$3 WHERE email = $4';
      var value = [req.body.first_name, req.body.last_name, req.body.address, email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          pg.end();
        } else if (dbres.rowCount === 0) {
          console.log('An error occured, please check input');
          res.status(403).json({
            message: 'An error occured, please check input'
          });
          pg.end();
        } else {
          query = 'SELECT * FROM users WHERE email = $1';
          value = [email];
          console.log('this is ' + value);
          pg.query(query, value, function (err, dbres) {
            if (err) {
              console.log(err.stack);
              res.status(500).json({
                message: 'error encountered'
              });
              pg.end();
            } else {
              var username = dbres.rows[0].first_name;

              if (username === null) {
                username = 'user';
              }

              res.status(200).send({
                username: username,
                state: 'success',
                status: 200,
                message: 'Profile updated',
                token: token
              });
              pg.end();
            }
          });
        }
      });
    }
  });
}; // GET A USER


var getAUser = function getAUser(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var token = req.token;

    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      var useremail = authData.user.email;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      var value = [useremail]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          var data = dbres.rows[0];
          var email = data.email,
              first_name = data.first_name,
              last_name = data.last_name,
              address = data.address;
          res.status(200).json({
            email: email,
            first_name: first_name,
            last_name: last_name,
            address: address,
            token: token
          });
          pg.end();
        }
      });
    }
  });
}; // TOKEN VERIFICATION


var tokenVerify = function tokenVerify(req, res) {
  jwt.verify(req.body.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.json({
        status: 403,
        message: 'Session Expired'
      });
    } else {
      res.json({
        status: 200
      });
    }
  });
};

module.exports = {
  signUp: signUp,
  verifyUser: verifyUser,
  updateUser: updateUser,
  getAUser: getAUser,
  tokenVerify: tokenVerify
};