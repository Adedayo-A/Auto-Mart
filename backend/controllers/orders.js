"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteOrder = exports.patchOrder = exports.getAnOrder = exports.getMyOrders = exports.postOrder = void 0;

var _pg = require("pg");

var respondErr = function respondErr(err, res) {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered'
    }
  });
};

var postOrder = function postOrder(req, res) {
  var data = req.data;
  var email = data.user.email;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  var value = [email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      var buyer = dbres.rows[0].id;
      var newOrder = req.body;
      var car_id = req.params.id;
      var description = newOrder.description;
      var amount = newOrder.price_offered;
      var status = 'pending';
      query = 'SELECT * FROM carads WHERE id = $1';
      value = [car_id];
      pg.query(query, value, function (err, dbresp) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else {
          var image = dbresp.rows[0].image_url;
          var manufacturer = dbresp.rows[0].manufacturer;
          var model = dbresp.rows[0].model;
          var car_owner = dbresp.rows[0].owner;
          var priceofCar = dbresp.rows[0].price;
          query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer, description, image, manufacturer, model, car_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          value = [status, amount, car_id, buyer, description, image, manufacturer, model, car_owner]; // eslint-disable-next-line consistent-return
          // PG Query

          pg.query(query, value, function (err) {
            if (err) {
              console.error(err);
              res.status(403).json({
                status: 403,
                error: {
                  message: 'Input error, Please check input!!!'
                }
              });
              pg.end();
            } else {
              var created_on = Date.now();
              res.status(200).json({
                status: 200,
                data: {
                  message: 'Posted successfully',
                  buyer: buyer,
                  car_id: car_id,
                  created_on: created_on,
                  status: status,
                  priceofCar: priceofCar,
                  manufacturer: manufacturer,
                  model: model,
                  car_owner: car_owner,
                  image: image,
                  amount: amount
                }
              });
              pg.end();
            }
          });
        }
      });
    }
  });
};

exports.postOrder = postOrder;

var getMyOrders = function getMyOrders(req, res) {
  var data = req.data;
  var email = data.user.email;
  console.log(email);
  var query;
  var value;
  var currUser;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  value = [email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      currUser = dbres.rows[0].id;
      query = 'SELECT * FROM purchaseorder WHERE buyer = $1';
      value = [currUser];
      pg.query(query, value, function (err, dbresp) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbresp.rows.length === 0) {
          res.status(200).json({
            data: {
              message: 'No order found'
            }
          });
          pg.end();
        } else {
          var orders = dbresp.rows;
          res.status(200).json({
            data: {
              state: 'success',
              message: 'result completed',
              orders: orders
            }
          });
          pg.end();
        }
      });
    }
  });
}; // GET A SPECIFIC ORDER


exports.getMyOrders = getMyOrders;

var getAnOrder = function getAnOrder(req, res) {
  var orderId = req.params.orderid;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect(); // eslint-disable-next-line consistent-return

  var query = 'SELECT * FROM purchaseorder WHERE id = $1';
  var value = [orderId];
  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      var order = dbres.rows;
      res.status(200).json({
        data: {
          state: 'success',
          message: 'Success, result completed',
          order: order
        }
      });
      pg.end();
    }
  });
}; // PATCH ORDER


exports.getAnOrder = getAnOrder;

var patchOrder = function patchOrder(req, res) {
  var data = req.data;
  var email = data.user.email;
  var order = req.body;
  var query;
  var value;
  var currUser;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
  value = [email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      currUser = dbres.rows[0].id;
      query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
      value = [req.params.id]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbresp) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbresp.rows.length === 0) {
          res.status(200).json({
            status: 200,
            data: {
              message: 'No order found'
            }
          });
          pg.end();
        } else {
          var buyer = dbresp.rows[0].buyer;
          var priceOffered = order.price_offered;

          if (currUser === buyer) {
            query = 'UPDATE purchaseorder SET amount=$1';
            value = [priceOffered]; // eslint-disable-next-line consistent-return
            // eslint-disable-next-line no-unused-vars

            pg.query(query, value, function (err, dbresponse) {
              if (err) {
                respondErr(err, res);
                pg.end();
              } else {
                res.status(200).json({
                  status: 200,
                  data: {
                    status: 200,
                    message: 'Order updated successfully!!',
                    order: order
                  }
                });
                pg.end();
              }
            });
          } else {
            res.status(403).json({
              error: {
                message: 'You are not permiited to update this ad!!!'
              }
            });
            pg.end();
          }
        }
      });
    }
  });
}; // DELETE ORDER


exports.patchOrder = patchOrder;

var deleteOrder = function deleteOrder(req, res) {
  var data = req.data;
  var email = data.user.email;
  console.log(email);
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  var value = [email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
    } else {
      var user = dbres.rows[0].id;
      var order = req.params.id;
      query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
      value = [order];
      pg.query(query, value, function (err, resp) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (resp.rows[0].buyer === user) {
          query = 'DELETE FROM carads WHERE id = $1';
          value = [order]; // eslint-disable-next-line consistent-return
          // eslint-disable-next-line no-unused-vars

          pg.query(query, value, function (err, resdb) {
            if (err) {
              respondErr(err, res);
              pg.end();
            } else {
              res.status(200).json({
                data: {
                  status: 200,
                  message: 'AD successfully deleted'
                }
              });
              pg.end();
            }
          });
        } else {
          res.status(403).json({
            error: {
              status: 403,
              message: 'You are not permitted to delete this Ad'
            }
          });
          pg.end();
        }
      });
    }
  });
};

exports.deleteOrder = deleteOrder;