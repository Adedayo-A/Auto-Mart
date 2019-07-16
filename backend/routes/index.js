"use strict";

var express = require('express');

var carControllers = require('../controllers/cars.js');

var userControllers = require('../controllers/users.js');

var orderControllers = require('../controllers/orders.js');

var flagControllers = require('../controllers/flags.js');

var middlewares = require('../middlewares/user.js'); // const { tokenAuth } = middleControllers;


var getCar = carControllers.getCar,
    getCars = carControllers.getCars,
    postCar = carControllers.postCar,
    patchCar = carControllers.patchCar,
    deleteCar = carControllers.deleteCar;
var signUp = userControllers.signUp,
    verifyUser = userControllers.verifyUser,
    updateUser = userControllers.updateUser,
    getAUser = userControllers.getAUser;
var postOrder = orderControllers.postOrder,
    patchOrder = orderControllers.patchOrder;
var postFlag = flagControllers.postFlag;
var tokenAuth = middlewares.tokenAuth,
    checkPwd = middlewares.checkPwd,
    validateEmail = middlewares.validateEmail;
var router = express.Router(); // CAR ADs API ROUTES

router.get('/api/v1/car/', tokenAuth, getCars);
router.get('/api/v1/car/:id', tokenAuth, getCar);
router.post('/api/v1/car/', tokenAuth, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, patchCar);
router["delete"]('/api/v1/car/:id/', tokenAuth, deleteCar); // USERS API ROUTES

router.patch('/api/v1/users/auth/update', tokenAuth, updateUser);
router.post('/api/v1/users/auth/signup', validateEmail, checkPwd, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, getAUser); // ORDERS API ROUTES

router.post('/api/v1/order/', tokenAuth, postOrder);
router.patch('/api/v1/order/:id/price', tokenAuth, patchOrder); // FLAGS API ROUTES

router.post('/api/v1/flag/', tokenAuth, postFlag);
module.exports = router;