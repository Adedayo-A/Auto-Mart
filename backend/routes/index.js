const express = require('express');
const carControllers = require('../controllers/cars.js');
const userControllers = require('../controllers/users.js');
const tokenAuth = require('../middlewares/user');

const router = express.Router();

// CARS API FUNCTIONS
router.get('/api/v1/car/', carControllers.getCars);
router.get('/api/v1/car/:id', carControllers.getCar);

// USERS API FUNCTIONS
router.post('/api/v1/users/login', userControllers.verifyUser);
router.post('/api/v1/users/createpost', tokenAuth, userControllers.protectedRoute);
router.post('/api/v1/users/signup', userControllers.signUp);
router.post('/api/v1/users/signin', userControllers.verifyUser);

module.exports = router;
