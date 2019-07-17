"use strict";

var express = require('express');

var carControllers = require('../controllers/cars.js');

var userControllers = require('../controllers/users.js');

var orderControllers = require('../controllers/orders.js');

var flagControllers = require('../controllers/flags.js');

var imgControllers = require('../controllers/images.js');

var middlewares = require('../middlewares/user.js'); // const { tokenAuth } = middleControllers;


var getCar = carControllers.getCar,
    getCars = carControllers.getCars,
    postCar = carControllers.postCar,
    patchCar = carControllers.patchCar,
    deleteCar = carControllers.deleteCar,
    getadsByOwner = carControllers.getadsByOwner,
    getCarOrders = carControllers.getCarOrders,
    updateCarOrders = carControllers.updateCarOrders;
var signUp = userControllers.signUp,
    verifyUser = userControllers.verifyUser,
    updateUser = userControllers.updateUser,
    getAUser = userControllers.getAUser,
    tokenVerify = userControllers.tokenVerify;
var postOrder = orderControllers.postOrder,
    patchOrder = orderControllers.patchOrder,
    getMyOrders = orderControllers.getMyOrders,
    getAnOrder = orderControllers.getAnOrder,
    deleteOrder = orderControllers.deleteOrder;
var postFlag = flagControllers.postFlag;
var tokenAuth = middlewares.tokenAuth,
    validateInfo = middlewares.validateInfo;
var imgUploader = imgControllers.imgUploader;
var router = express.Router(); // CAR ADs API ROUTES

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
router["delete"]('/api/v1/car/:id/', tokenAuth, deleteCar);
router["delete"]('/car/:id/', tokenAuth, deleteCar);
router.get('/api/v1/car/carorders', tokenAuth, getCarOrders);
router.patch('/api/v1/car/:id/carorders', tokenAuth, updateCarOrders); // USERS API ROUTES

router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify);
router.post('/auth/signin', verifyUser); // ORDERS API ROUTES

router.get('/api/v1/order/user', tokenAuth, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, postOrder);
router.post('/order', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, patchOrder);
router.patch('/order/:id/price', tokenAuth, patchOrder);
router["delete"]('/api/v1/order/:id/', tokenAuth, deleteOrder); // FLAGS API ROUTES

router.post('/api/v1/flag/:id', tokenAuth, postFlag); // IMG API ROUTES

router.post('/api/v1/upload/', tokenAuth, imgUploader);
module.exports = router;