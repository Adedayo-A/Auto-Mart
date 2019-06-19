/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const users = require('../db/Users.js');

// const cars = require('../db/Cars.js');

// class userControllers { 
const signUp = (req, res) => {
  req.body.id = users.length + 1;
  const newUser = req.body;
  users.push(newUser);
  jwt.sign({ newUser }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
    res.status(200).send({
      message: 'Signed up successful',
      newUser,
      token,
    });
  });
};

const verifyUser = (req, res) => {
  // eslint-disable-next-line max-len
  const foundUser = users.some(user => user.email === req.body.email && user.password === parseInt(req.body.password, 10));
  if (foundUser) {
    // eslint-disable-next-line max-len
    const regUser = users.filter(user => user.email === req.body.email && user.password === parseInt(req.body.password, 10));
    const verifiedUser = regUser[0];
    jwt.sign({ verifiedUser }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {  
      res.status(200).json({
        message: 'Signed in successfully',
        token,
        verifiedUser,
      });
    });
  } else {
    res.status(404).json({
      message: 'Invalid user',
    });
  }
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