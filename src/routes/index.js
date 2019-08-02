// import {} from '../controllers/users';
import express from 'express';
import * as userControllers from '../controllers/users';
import * as carControllers from '../controllers/cars';
import * as orderControllers from '../controllers/orders';
import postFlag from '../controllers/flags';
import imgUploader from '../controllers/images';
import * as middlewares from '../middlewares/user';

const {
  getCar, getCars, postCar, patchCar, deleteCar, getadsByOwner,
  getCarOrders, updateCarOrders, getACarOrder,
} = carControllers;

const {
  signUp, verifyUser, updateUser, getAUser, tokenVerify,
} = userControllers;

const {
  postOrder, patchOrder, getMyOrders, getAnOrder, deleteOrder,
} = orderControllers;

// const { postFlag } = flagControllers;
const {
  tokenAuth, validateInfo, tokenverify,
} = middlewares;

// const { imgUploader } = imgControllers;

const router = express.Router();

// CAR ADs API ROUTES
router.get('/api/v1/car/ads', tokenAuth, tokenverify, getadsByOwner);
router.get('/api/v1/car/', tokenAuth, tokenverify, getCars);
router.get('/api/v1/car/:id', tokenAuth, tokenverify, getCar);
router.post('/api/v1/car/', tokenAuth, tokenverify, postCar);
router.patch('/api/v1/car/:id/', tokenAuth, tokenverify, patchCar);
router.delete('/api/v1/car/:id/', tokenAuth, tokenverify, deleteCar);
router.get('/api/v1/cars/carorders/', tokenAuth, tokenverify, getCarOrders);
router.get('/api/v1/cars/:id/carorders/', tokenAuth, tokenverify, getACarOrder);
router.patch('/api/v1/cars/:id/carorders/', tokenAuth, updateCarOrders);


// USERS API ROUTES
router.patch('/api/v1/users/auth/update', tokenAuth, tokenverify, updateUser);
router.post('/api/v1/users/auth/signup', validateInfo, signUp);
router.post('/api/v1/users/auth/signin', verifyUser);
router.get('/api/v1/users/auth/getuser', tokenAuth, tokenverify, getAUser);
router.post('/api/v1/users/auth/tokenverify', tokenVerify);


// ORDERS API ROUTES
router.get('/api/v1/order/user', tokenAuth, tokenverify, getMyOrders);
router.get('/api/v1/order/:orderid', tokenAuth, tokenverify, getAnOrder);
router.post('/api/v1/order/:id', tokenAuth, tokenverify, postOrder);
router.patch('/api/v1/order/:id/', tokenAuth, tokenverify, patchOrder);
router.delete('/api/v1/order/:id/', tokenAuth, tokenverify, deleteOrder);


// FLAGS API ROUTES
router.post('/api/v1/flag/:id', tokenAuth, tokenverify, postFlag);

// IMG API ROUTES
router.post('/api/v1/upload/', tokenAuth, tokenverify, imgUploader);

export default router;
