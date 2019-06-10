const controllers = require('../controllers/car.js')
const express = require('express');
const router = express.Router();

router.get('/api/v1/car/', controllers.getCars);
router.get('/api/v1/car/:id', controllers.getCar);  

module.exports = router;
