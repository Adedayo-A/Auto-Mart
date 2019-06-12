const express = require('express');
const carControllers = require('../controllers/cars.js');
const userControllers = require('../controllers/users.js');
const tokenAuth = require('../middlewares/user');

const { getCar, getCars } = carControllers;
const { signUp, verifyUser, protectedRoute } = userControllers;

const router = express.Router();
// CARS API FUNCTIONS
router.get('/api/v1/car/', getCars);
router.get('/api/v1/car/:id', getCar);

// USERS API FUNCTIONS
router.post('/api/v1/users/login', userControllers.verifyUser);
router.post('/api/v1/users/createpost', tokenAuth, protectedRoute);
router.post('/api/v1/users/auth/signup', signUp);
router.post('/api/v1/users/auth/signin', verifyUser);

module.exports = router;
