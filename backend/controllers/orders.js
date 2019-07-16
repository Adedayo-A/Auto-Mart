"use strict";

var jwt = require('jsonwebtoken'); // eslint-disable-next-line import/no-extraneous-dependencies


var _require = require('pg'),
    Client = _require.Client; // const cars = require('../db/Cars.js');
// const orders = require('../db/Orders.js');


var postOrder = function postOrder(req, res) {
  var newOrder = req.body; // eslint-disable-next-line no-unused-vars

  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token'
      });
    } else {
      newOrder.status = 'pending';
      var pg = new Client({
        connectionString: process.env.db_URL
      }); // PG Connect

      pg.connect();
      var query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer) VALUES($1, $2, $3, $4)';
      var value = [newOrder.status, newOrder.amount, newOrder.car_id, newOrder.buyer]; // eslint-disable-next-line consistent-return
      // PG Query

      pg.query(query, value, function (err) {
        if (err) {
          // console.error(err);
          res.status(403).json({
            message: 'Input error, Please check input!!!',
            newOrder: newOrder
          });
          pg.end();
        } else {
          res.status(200).json({
            message: 'Posted successfully',
            newOrder: newOrder
          });
          pg.end();
        }
      });
    }
  });
};

var patchOrder = function patchOrder(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    // eslint-disable-next-line prefer-destructuring
    var email = authData.user.email;

    if (err) {
      res.status(403).json({
        message: 'error..invalid Token'
      });
    } else {
      var order = req.body;
      var query;
      var value;
      var currUser;
      var buyer;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          currUser = dbres.rows[0].id;
        }

        query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
        value = [req.params.id]; // eslint-disable-next-line consistent-return

        pg.query(query, value, function (err, dbresp) {
          if (err) {
            console.error(err);
            pg.end();
          } else if (dbresp.rows.length === 0) {
            res.status(200).json({
              message: 'No order found'
            });
            pg.end();
          } else {
            // eslint-disable-next-line prefer-destructuring
            buyer = dbresp.rows[0].buyer;
          }

          if (currUser === buyer) {
            query = 'UPDATE purchaseorder SET amount=$1';
            value = [order.amount]; // eslint-disable-next-line consistent-return
            // eslint-disable-next-line no-unused-vars

            pg.query(query, value, function (err, dbresponse) {
              if (err) {
                // console.error(err);
                res.status(403).json({
                  message: 'An error occured, Please check input!!!'
                });
                pg.end();
              } else {
                res.status(200).json({
                  message: 'Order updated successfully!!',
                  order: order
                });
                pg.end();
              }
            });
          } else {
            res.status(403).json({
              message: 'You are not permiited to update this ad!!!'
            });
            pg.end();
          }
        });
      });
    }
  });
};

module.exports = {
  postOrder: postOrder,
  patchOrder: patchOrder
};