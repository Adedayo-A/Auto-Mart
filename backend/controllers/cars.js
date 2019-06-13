/* eslint-disable linebreak-style */
const cars = require('../db/Cars.js');

// class carControllers {
// GET REQUESTS
const getCars = (req, res) => {
  let allCars = cars;
  // PRICE-RANGE
  if (req.query.min_price && req.query.max_price && req.query.status) {
    const foundStatus = allCars.some(car => car.status === req.query.status);
    if (foundStatus) {
      allCars = allCars.filter(availableCar => availableCar.status === req.query.status);
    } else {
      res.status(400).json({ msg: `No car with the status of ${req.query.status}` });
    }
    const foundPrice = allCars.some(car => car.price >= parseInt(req.query.min_price, 10) && car.price <= parseInt(req.query.max_price, 10));
    if (foundPrice) {
      allCars = allCars.filter(car => car.price >= parseInt(req.query.min_price, 10) && car.price <= parseInt(req.query.max_price, 10));
      res.status(200).json(allCars);
    } else {
      res.status(400).json({ msg: `We could not find ${req.query.status} cars with  within the price range of ${req.query.min_price} and ${req.query.max_price}` });
    }
  }
  //  State and Status
  if (req.query.state && req.query.status) {
    const foundState = allCars.some(car => car.state === req.query.state);
    if (foundState) {
      allCars = allCars.filter(car => car.state === req.query.state);
    } else {
      res.status(400).json({ msg: `No car with the state of ${req.query.state}` });
    }
    const foundStatus = allCars.some(car => car.status === req.query.status);
    if (foundStatus) {
      allCars = allCars.filter(car => car.status === req.query.status);
      res.status(200).json(allCars);
    } else {
      res.status(400).json({ msg: `No car was found with the status of ${req.query.status}` });
    }
  }
  // Status
  if (req.query.status) {
    const found = allCars.some(car => car.status === req.query.status);
    if (found) {
      allCars = allCars.filter(car => car.status === req.query.status);
      res.status(200).json(allCars);
    } else {
      res.status(400).json({ msg: `No car was found with the status of ${req.query.status}` });
    }
  }
  // BodyType
  if (req.query.body_type) {
    const foundBodyType = allCars.some(car => car.body_type === req.query.body_type);
    if (foundBodyType) {
      allCars = allCars.filter(car => car.body_type === req.query.body_type);
      res.status(200).json(allCars);
    } else {
      res.status(400).json({ msg: `No car was found with the body_type of ${req.query.body_type}` });
    }
  }
  //  Make
  if (req.query.manufacturer) {
    const foundManufacturer = allCars.some(car => car.manufacturer === req.query.manufacturer);
    if (foundManufacturer) {
      allCars = allCars.filter(car => car.manufacturer === req.query.manufacturer);
      res.status(200).json(allCars);
    } else {
      res.status(400).json({ msg: `No car was found with the make of ${req.query.manufacturer}` });
    }
  }
  // REST
  res.status(200).json(cars);
};
const getCar = (req, res) => {
  const found = cars.some(car => car.id === parseInt(req.params.id, 16));
  if (found) {
    // eslint-disable-next-line radix
    const requestedCar = cars.filter(car => car.id === parseInt(req.params.id));
    res.status(200).json(requestedCar);
  } else {
    res.status(400).json({ msg: `No car was found with the id of ${req.params.id}` });
  }
};

module.exports = {
  getCars,
  getCar,
};