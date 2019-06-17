const express = require('express');
const carControllers = require('../controllers/cars.js');
const userControllers = require('../controllers/users.js');
const orderControllers = require('../controllers/orders.js');
const flagControllers = require('../controllers/flags.js')
const tokenAuth = require('../middlewares/user.js');

const { getCar, getCars, postCar, patchCar, deleteCar } = carControllers;
const { signUp, verifyUser, protectedRoute } = userControllers;
const { postOrder, patchOrder } = orderControllers;
const { postFlag } = flagControllers;

const router = express.Router();

// CARS API ROUTES
router.get('/api/v1/car/', getCars);
router.get('/api/v1/car/:id', getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router.delete('/api/v1/car/:id/', tokenAuth, deleteCar);

// USERS API ROUTES
router.post('/api/v1/users/createpost', protectedRoute);
router.post('/api/v1/users/auth/signup', signUp);
router.post('/api/v1/users/auth/signin', verifyUser);

// ORDERS API ROUTES
router.post('/api/v1/order/', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/price', tokenAuth, patchOrder);

// FLAGS API ROUTES
router.post('/api/v1/flag/', postFlag);


module.exports = router;