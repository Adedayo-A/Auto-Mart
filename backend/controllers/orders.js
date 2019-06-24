const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');
// const cars = require('../db/Cars.js');
// const orders = require('../db/Orders.js');

// const jwtKey = require('../bin/www');

const postOrder = (req, res) => {
  const newOrder = req.body;
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..Invalid Token',
      });
    } else {
      newOrder.status = 'pending';
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      // PG Connect
      pg.connect();

      const query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer) VALUES($1, $2, $3, $4)';
      const value = [newOrder.status, newOrder.amount, newOrder.car_id, newOrder.buyer];
      // eslint-disable-next-line consistent-return
      // PG Query
      pg.query(query, value, (err, dbRes) => {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'Input error, Please check input!!!',
            newOrder,
          });
        } else {
          console.log(dbRes);
          res.status(200).json({
            message: 'Posted successfully',
            newOrder,
          });
        }
      });
    }
  });
};

const patchOrder = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..incorrect Token',
      });
    } else {
      const editedOrder = req.body;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      // PG Connect
      pg.connect();

      const query = 'UPDATE purchaseorder SET amount=$1 WHERE buyer = $2';
      const value = [editedOrder.amount, editedOrder.buyer];
      // eslint-disable-next-line consistent-return
      // PG Query
      // eslint-disable-next-line no-unused-vars
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'An error occured, Please check input!!!',
          });
        } else {
          res.status(200).json({
            message: 'Updated successfully',
            editedOrder,
          });
        }
      });
    }
  });
};
module.exports = {
  postOrder,
  patchOrder,
};
