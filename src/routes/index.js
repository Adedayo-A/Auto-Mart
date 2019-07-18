const express = require('express');
// import exprress from 'express'
const carControllers = require('../controllers/cars.js');
// import * as userControllers from ''
// import { verifyUser } from ''
const userControllers = require('../controllers/users.js');
const orderControllers = require('../controllers/orders.js');
const flagControllers = require('../controllers/flags.js');
const imgControllers = require('../controllers/images.js');
const middlewares = require('../middlewares/user.js');

// const { tokenAuth } = middleControllers;
const {
  getCar, getCars, postCar, patchCar, deleteCar, getadsByOwner, getCarOrders, updateCarOrders, getACarOrder,
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
router.get('/car/', tokenAuth, getCars);
router.get('/api/v1/car/:id', tokenAuth, getCar);
router.get('/car/:id', tokenAuth, getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.post('/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router.patch('/car/:id/status', tokenAuth, patchCar);
router.patch('/car/:id/price', tokenAuth, patchCar);
router.delete('/api/v1/car/:id/', tokenAuth, deleteCar);
router.delete('/car/:id/', tokenAuth, deleteCar);
router.get('/api/v1/cars/carorders/', tokenAuth, getCarOrders);
router.get('/api/v1/cars/:id/carorders/', tokenAuth, getACarOrder);
router.patch('/api/v1/cars/:id/carorders/', tokenAuth, updateCarOrders);


// USERS API ROUTES
router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify);
router.post('/auth/signin', verifyUser);


// ORDERS API ROUTES
router.get('/api/v1/order/user', tokenAuth, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, postOrder);
router.post('/order/:id', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, patchOrder);
router.patch('/order/:id/price', tokenAuth, patchOrder);
router.delete('/api/v1/order/:id/', tokenAuth, deleteOrder);


// FLAGS API ROUTES
router.post('/api/v1/flag/:id', tokenAuth, postFlag);
router.post('/flag/:id', tokenAuth, postFlag);


// IMG API ROUTES
router.post('/api/v1/upload/', tokenAuth, imgUploader);


module.exports = router;
// export default router

