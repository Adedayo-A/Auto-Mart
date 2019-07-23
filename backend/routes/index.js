"use strict";

var _express = _interopRequireDefault(require("express"));

var userControllers = _interopRequireWildcard(require("../controllers/users"));

var carControllers = _interopRequireWildcard(require("../controllers/cars"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const express = require('express');
// const carControllers = require('../controllers/cars.js');
// import {} from '../controllers/users';
// const userControllers = require('../controllers/users.js');
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
    updateCarOrders = carControllers.updateCarOrders,
    getACarOrder = carControllers.getACarOrder;
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

var router = _express["default"].Router(); // CAR ADs API ROUTES


router.get('/api/v1/car/ads', tokenAuth, getadsByOwner);
router.get('/api/v1/car/', tokenAuth, getCars);
router.get('/api/v1/car/:id', tokenAuth, getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router["delete"]('/api/v1/car/:id/', tokenAuth, deleteCar);
router.get('/api/v1/cars/carorders/', tokenAuth, getCarOrders);
router.get('/api/v1/cars/:id/carorders/', tokenAuth, getACarOrder);
router.patch('/api/v1/cars/:id/carorders/', tokenAuth, updateCarOrders); // USERS API ROUTES

router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify); // ORDERS API ROUTES

router.get('/api/v1/order/user', tokenAuth, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, patchOrder);
router["delete"]('/api/v1/order/:id/', tokenAuth, deleteOrder); // FLAGS API ROUTES

router.post('/api/v1/flag/:id', tokenAuth, postFlag); // IMG API ROUTES

router.post('/api/v1/upload/', tokenAuth, imgUploader);
module.exports = router; // export default router