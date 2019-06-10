const controllers = require('../controllers/car.js')
const express = require('express');
const router = express.Router();

  router.get('/api/v1/car/', controllers.getCars);
  router.get('/api/v1/car/:id', controllers.getCar);
    
  
    // app.post('/api/v1/cars', controllers.addCars)
    // app.put('/api/v1/cars/:id', controllers.modifySaleOrder)
  
  

module.exports = router;
