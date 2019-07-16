const express = require('express');
const carControllers = require('../controllers/cars.js');
const userControllers = require('../controllers/users.js');
const orderControllers = require('../controllers/orders.js');
const flagControllers = require('../controllers/flags.js');
const imgControllers = require('../controllers/images.js');
const middlewares = require('../middlewares/user.js');

// const { tokenAuth } = middleControllers;
const {
  getCar, getCars, postCar, patchCar, deleteCar, getadsByOwner, getCarOrders, updateCarOrders,
} = carControllers;

const {
  signUp, verifyUser, updateUser, getAUser, tokenVerify,
} = userControllers;

const {
  postOrder, patchOrder, getMyOrders, getAnOrder, deleteOrder,
} = orderControllers;

const { postFlag } = flagControllers;
const {
  tokenAuth, validateInfo,
} = middlewares;

const { imgUploader } = imgControllers;

const router = express.Router();

// CAR ADs API ROUTES
router.get('/api/v1/car/ads', tokenAuth, getadsByOwner);
router.get('/api/v1/car/', tokenAuth, getCars);
router.get('/api/v1/car/:id', tokenAuth, getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router.delete('/api/v1/car/:id/', tokenAuth, deleteCar);
router.get('/api/v1/car/carorders', tokenAuth, getCarOrders);
router.patch('/api/v1/car/:id/carorders', tokenAuth, updateCarOrders);


// USERS API ROUTES
router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify);


// ORDERS API ROUTES
router.get('/api/v1/order/user', tokenAuth, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, patchOrder);
router.delete('/api/v1/order/:id/', tokenAuth, deleteOrder);


// FLAGS API ROUTES
router.post('/api/v1/flag/:id', tokenAuth, postFlag);

// IMG API ROUTES
router.post('/api/v1/upload/', tokenAuth, imgUploader);


module.exports = router;
