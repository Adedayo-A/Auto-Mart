const controllers = require('../controllers/car.js')
const express = require('express');
const router = express.Router();

  router.get('/api/v1/car/', controllers.getCars);
  router.get('/api/v1/car/:id', controllers.getCar);
    
  
  // app.post('/api/v1/cars', controllers.addCars)
    // app.put('/api/v1/cars/:id', controllers.modifySaleOrder)
    // app.delete('/api/v1/cars/:id', controllers.deleteSaleOder)
    // app.get('/api/v1/cars/:status', controllers.getAllUnsoldCars);
    // app.get('/api/v1/cars/:priceRange', controllers.getCarsByPriceRange);
    // router.get('/', book_controller.index)

module.exports = router;
