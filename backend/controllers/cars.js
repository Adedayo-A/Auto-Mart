/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');

const jwt = require('jsonwebtoken');
const cars = require('../db/Cars.js');

// const jwtKey = require('../bin/www');

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
      res.status(404).json({ msg: `No car with the status of ${req.query.status}` });
    }
    // eslint-disable-next-line max-len
    const foundPrice = allCars.some(car => car.price >= parseInt(req.query.min_price, 10) && car.price <= parseInt(req.query.max_price, 10));
    if (foundPrice) {
      // eslint-disable-next-line max-len
      allCars = allCars.filter(car => car.price >= parseInt(req.query.min_price, 10) && car.price <= parseInt(req.query.max_price, 10));
      res.status(200).json(allCars);
    } else {
      res.status(404).json({ msg: `We could not find ${req.query.status} cars with  within the price range of ${req.query.min_price} and ${req.query.max_price}` });
    }
  } else if (req.query.state && req.query.status) {
    const foundState = allCars.some(car => car.state === req.query.state);
    if (foundState) {
      allCars = allCars.filter(car => car.state === req.query.state);
    } else {
      res.status(404).json({ msg: `No car with the state of ${req.query.state}` });
    }
    const foundStatus = allCars.some(car => car.status === req.query.status);
    if (foundStatus) {
      allCars = allCars.filter(car => car.status === req.query.status);
      res.status(200).json(allCars);
    } else {
      res.status(404).json({ msg: `No car was found with the status of ${req.query.status}` });
    }
  } else if (req.query.status && req.query.manufacturer) {
    const foundStatus = allCars.some(car => car.status === req.query.status);
    if (foundStatus) {
      allCars = allCars.filter(car => car.status === req.query.status);
    } else {
      res.status(404).json({ msg: `No car with the state of ${req.query.state}` });
    }
    const foundManufacturer = allCars.some(car => car.manufacturer === req.query.manufacturer);
    if (foundManufacturer) {
      allCars = allCars.filter(car => car.manufacturer === req.query.manufacturer);
      res.status(200).json(allCars);
    } else {
      res.status(404).json({ msg: `No car was found with the make of ${req.query.manufacturer}` });
    }
  } else if (req.query.status) {
    const found = allCars.some(car => car.status === req.query.status);
    if (found) {
      allCars = allCars.filter(car => car.status === req.query.status);
      res.status(200).json(allCars);
    } else {
      res.status(404).json({ msg: `No car was found with the status of ${req.query.status}` });
    }
  } else if (req.query.body_type) {
    const foundBodyType = allCars.some(car => car.body_type === req.query.body_type);
    if (foundBodyType) {
      allCars = allCars.filter(car => car.body_type === req.query.body_type);
      res.status(200).json(allCars);
    } else {
      res.status(404).json({ msg: `No car was found with the body_type of ${req.query.body_type}` });
    }
  } else {
    res.status(200).json(cars);
  }
};
// GET SPECIFIC CAR
const getCar = (req, res) => {
  const found = cars.some(car => car.id === parseInt(req.params.id, 10));
  if (found) {
    // eslint-disable-next-line radix
    const requestedCar = cars.filter(car => car.id === parseInt(req.params.id));
    res.status(200).json(requestedCar);
  } else {
    res.status(404).json({ msg: `No car was found with the id of ${req.params.id}` });
  }
};
// POST CAR
const postCar = (req, res) => {
  const newAd = req.body;
  jwt.verify(req.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token',
      });
    } else {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      // PG Connect
      pg.connect();

      const query = 'INSERT INTO carads(status, price, manufacturer, model, body_type, owner) VALUES($1, $2, $3, $4, $5, $6)';
      const value = [newAd.status, newAd.price, newAd.manufacturer, newAd.model, newAd.body_type, newAd.owner];
      // eslint-disable-next-line consistent-return
      // PG Query
      pg.query(query, value, (err, dbRes) => {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'Input error, Please check input!!!',
            newAd,
          });
        } else {
          console.log(dbRes);
          res.status(200).json({
            message: 'Posted successfully',
            newAd,
          });
        }
      });
    }
  });
};

// PATCH CAR
const patchCar = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..incorrect Token',
      });
    } else {
      const foundCar = cars.filter(car => car.id === parseInt(req.params.id, 10));
      const editCar = foundCar[0];
      editCar.status = req.body.status;
      editCar.price = req.body.price;
      res.json({
        message: 'Updated successfully',
        authData,
        editCar,
      });
    }
  });
};

// DELETE CAR
const deleteCar = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(403).json({
        message: 'error..incorrect Token',
      });
    } else {
      const carId = parseInt(req.params.id, 10);
      cars.splice(carId - 1, 1);
      res.json({
        message: 'Deleted successfully',
        cars,
      });
    }
  });
};

module.exports = {
  getCars,
  getCar,
  postCar,
  patchCar,
  deleteCar,
};
