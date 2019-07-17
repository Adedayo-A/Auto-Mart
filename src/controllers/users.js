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
// export
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
      let query = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)';
      let value = [user.email, user.first_name, user.last_name, hashedPassword, 
        user.address, user.is_admin];
      
      // PG Connect
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-unused-vars
      pg.query(query, value, (err, dbRes) => {
        if (err) {
          if (err.constraint === 'users_email_key') {
            console.log(err);
            res.status(500).json({
              status: 500,
              error: {
                message: 'email already exist, please choose another email',
              },
            });
            pg.end();
          } else if (err) {
            console.log(err);
            res.status(500).json({
              status: 500,
              error: {
                message: 'error encountered',
              },
            });
            pg.end();
          }
        } else {
          jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '20m' }, (err, token) => {
            query = 'SELECT * FROM users WHERE email = $1';
            value = [user.email];
            pg.query(query, value, (err, dbres) => {
              if (err) {
                console.log(err.stack);
                res.status(500).json({
                  error: {
                    message: 'error encountered',
                  },
                });
                pg.end();
              } else {
                let username = dbres.rows[0].first_name;
                if (username === null) {
                  username = 'user';
                }
                res.status(200).send({
                  status: 200,
                  data: {
                    username,
                    state: 'success',
                    status: 200,
                    message: 'Sign up successful',
                    token, 
                  },
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
        status: 500,
        error: {
          message: 'error encountered',
        },
      });
      pg.end();
    } else if (dbres.rows.length === 0) {
      res.status(403).json({
        status: 403,
        error: {
          message: 'error encountered, Invalid Email',
        },
      });
      pg.end();
    } else {
      const dbPsw = dbres.rows[0].password;
      let username = dbres.rows[0].first_name;
      const admin = dbres.rows[0].is_admin;
      if (username === null) {
        username = 'user';
      }
      bcrypt.compare(myPassword, dbPsw, (err, match) => {
        if (err) {
          console.log(err.stack);
          res.status(503).json({
            status: 403,
            error: {
              message: 'error encountered',
            },
          });
          pg.end();
        } else if (!match) {
          res.status(403).json({
            status: 403,
            error: {
              message: 'error encountered, Invalid password',
            },
          });
          pg.end();   
        } else {
          jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '20m' }, (err, token) => {
            res.status(200).json({
              status: 200,
              data: {
                username,
                admin,
                message: `Success..Welcome Back ${username}`,
                token,
              },
            });
          });
          pg.end();
        }
      });
    }
  });
};

// UPDATE A USER
const updateUser = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    // eslint-disable-next-line prefer-destructuring    
    if (err) {
      res.status(401).json({
        status: 401,
        error: {
          message: 'error..invalid token',
        },
      });
    } else {
      // eslint-disable-next-line prefer-destructuring
      const token = req.token;
      const email = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      let query = 'UPDATE users SET first_name=$1, last_name=$2, address=$3 WHERE email = $4';
      let value = [req.body.first_name, req.body.last_name, req.body.address, email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          res.status(403).json({
            error: {
              message: 'error..',
            },
          });
          console.error(err);
          pg.end();
        } else if (dbres.rowCount === 0) {
          res.status(403).json({
            error: {
              message: 'An error occured, please check input',
            },
          });
          pg.end();
        } else {
          query = 'SELECT * FROM users WHERE email = $1';
          value = [email];
          pg.query(query, value, (err, dbres) => {
            if (err) {
              console.log(err.stack);
              res.status(500).json({
                error: {
                  message: 'error encountered',
                },
              });
              pg.end();
            } else {
              let username = dbres.rows[0].first_name;
              if (username === null) {
                username = 'user';
              }
              res.status(200).send({
                data: {
                  username,
                  state: 'success',
                  status: 200,
                  message: 'Profile updated',
                  token,
                },
              });
              pg.end();
            }
          });
        }
      });
    }
  });
};

// GET A USER
const getAUser = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    const { token } = req.token;
    if (err) {
      res.status(403).json({
        error: {
          message: 'error..invalid token',
        },
      });
    } else {
      const useremail = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      const value = [useremail];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          res.status(403).json({
            status: 403,
            error: {
              message: 'error..',
            },
          });
          console.log(err);
          pg.end();
        } else {
          const data = dbres.rows[0];
          const {
            email, first_name, last_name, address,
          } = data;
          res.status(200).json({
            status: 200,
            data: {
              email, 
              first_name,
              last_name,
              address,
              token,
            },
          });
          pg.end();
        }
      });
    }
  });
};

// TOKEN VERIFICATION
const tokenVerify = (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.json({
        status: 401,
        error: {
          message: 'Session Expired',
        },
      });
    } else {
      res.json({
        status: 200,
      });
    }
  });
};


module.exports = {
  signUp,
  verifyUser,
  updateUser,
  getAUser,
  tokenVerify,
};
