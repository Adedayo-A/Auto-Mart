const express = require('express');
const carControllers = require('../controllers/cars.js');
const userControllers = require('../controllers/users.js');
const orderControllers = require('../controllers/orders.js');
const flagControllers = require('../controllers/flags.js');
const middlewares = require('../middlewares/user.js');

// const { tokenAuth } = middleControllers;
const {
  getCar, getCars, postCar, patchCar, deleteCar,
} = carControllers;
const { signUp, verifyUser, updateUser } = userControllers;
const { postOrder, patchOrder } = orderControllers;
const { postFlag } = flagControllers;
const {
  tokenAuth, checkPwd, validateEmail,
} = middlewares;


const router = express.Router();

// CAR ADs API ROUTES
router.get('/api/v1/car/', tokenAuth, getCars);
router.get('/api/v1/car/:id', tokenAuth, getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router.delete('/api/v1/car/:id/', tokenAuth, deleteCar);

// USERS API ROUTES
router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateEmail, checkPwd, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);

// ORDERS API ROUTES
router.post('/api/v1/order/', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/price', tokenAuth, patchOrder);

// FLAGS API ROUTES
router.post('/api/v1/flag/', tokenAuth, postFlag);


module.exports = router;
