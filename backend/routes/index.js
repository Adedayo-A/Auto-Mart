"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var userControllers = _interopRequireWildcard(require("../controllers/users"));

var carControllers = _interopRequireWildcard(require("../controllers/cars"));

var orderControllers = _interopRequireWildcard(require("../controllers/orders"));

var _flags = _interopRequireDefault(require("../controllers/flags"));

var _images = _interopRequireDefault(require("../controllers/images"));

var middlewares = _interopRequireWildcard(require("../middlewares/user"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import {} from '../controllers/users';
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
    deleteOrder = orderControllers.deleteOrder; // const { postFlag } = flagControllers;

var tokenAuth = middlewares.tokenAuth,
    validateInfo = middlewares.validateInfo,
    tokenverify = middlewares.tokenverify; // const { imgUploader } = imgControllers;

var router = _express["default"].Router(); // CAR ADs API ROUTES


router.get('/api/v1/car/ads', tokenAuth, tokenverify, getadsByOwner);
router.get('/api/v1/car/', tokenAuth, tokenverify, getCars);
router.get('/api/v1/car/:id', tokenAuth, tokenverify, getCar);
router.post('/api/v1/car/', tokenAuth, tokenverify, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, tokenverify, patchCar);
router["delete"]('/api/v1/car/:id/', tokenAuth, tokenverify, deleteCar);
router.get('/api/v1/cars/carorders/', tokenAuth, tokenverify, getCarOrders);
router.get('/api/v1/cars/:id/carorders/', tokenAuth, tokenverify, getACarOrder);
router.patch('/api/v1/cars/:id/carorders/', tokenAuth, updateCarOrders); // USERS API ROUTES

router.patch('/api/v1/users/auth/update', tokenAuth, tokenverify, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, tokenverify, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify); // ORDERS API ROUTES

router.get('/api/v1/order/user', tokenAuth, tokenverify, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, tokenverify, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, tokenverify, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, tokenverify, patchOrder);
router["delete"]('/api/v1/order/:id/', tokenAuth, tokenverify, deleteOrder); // FLAGS API ROUTES

router.post('/api/v1/flag/:id', tokenAuth, tokenverify, _flags["default"]); // IMG API ROUTES

router.post('/api/v1/upload/', tokenAuth, tokenverify, _images["default"]);
var _default = router;
exports["default"] = _default;