/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const users = require('../db/Users.js');

const secretkey = 'secretkeyofaccess';

// class userControllers { 
const signUp = (req, res) => {
  req.body.id = users.length + 1;
  const newUser = req.body;
  users.push(req.body);
  jwt.sign({ newUser }, secretkey, (err, token) => {
    res.status(200).json({
      message: 'Signed in succesfully',
      token,
      newUser,
    });
  });
};

const verifyUser = (req, res) => {
  const foundUser = users.some(user => user.email === req.body.email && user.password === parseInt(req.body.password, 10));
  if (foundUser) {
    const verifiedUser = users.filter(user => user.email === req.body.email && user.password === parseInt(req.body.password, 10));
    jwt.sign({ verifiedUser }, secretkey, (err, token) => {
      res.status(200).json({
        message: 'Signed in succesfully',
        token,
      });
    });
  } else {
    res.status(404).json({
      message: 'Invalid user',
    });
  }
};

const protectedRoute = (req, res) => {
  jwt.verify(req.token, secretkey, (err, authData) => {
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
}