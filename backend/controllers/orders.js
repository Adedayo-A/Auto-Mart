"use strict";

var jwt = require('jsonwebtoken'); // eslint-disable-next-line import/no-extraneous-dependencies


var _require = require('pg'),
    Client = _require.Client; // const cars = require('../db/Cars.js');
// const orders = require('../db/Orders.js');


var postOrder = function postOrder(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      var newOrder = req.body;
      var carId = req.params.id;
      var description = newOrder.description;
      var email = authData.user.email;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      var value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: {
              status: 500,
              message: 'error..'
            }
          });
          pg.end();
        } else {
          var status = 'pending';
          var buyer = dbres.rows[0].id;
          query = 'SELECT * FROM carads WHERE id = $1';
          value = [carId];
          pg.query(query, value, function (err, dbresp) {
            if (err) {
              console.log(err);
              res.status(500).json({
                error: {
                  status: 500,
                  message: 'error..'
                }
              });
              pg.end();
            } else {
              var image = dbresp.rows[0].image_url;
              var manufacturer = dbresp.rows[0].manufacturer;
              var model = dbresp.rows[0].model;
              var carowner = dbresp.rows[0].owner;
              query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer, description, image, manufacturer, model, car_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
              value = [status, newOrder.amount, carId, buyer, description, image, manufacturer, model, carowner]; // eslint-disable-next-line consistent-return
              // PG Query

              pg.query(query, value, function (err) {
                if (err) {
                  console.error(err);
                  res.status(403).json({
                    status: 403,
                    message: 'Input error, Please check input!!!',
                    new_order: new_order
                  });
                  pg.end();
                } else {
                  res.status(200).json({
                    data: {
                      status: 200,
                      message: 'Posted successfully',
                      new_order: new_order
                    }
                  });
                  pg.end();
                }
              });
            }
          });
        }
      });
    }
  });
};

var getMyOrders = function getMyOrders(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      // eslint-disable-next-line prefer-destructuring
      var email = authData.user.email;
      var query;
      var value;
      var currUser;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: {
              status: 500,
              message: 'error..'
            }
          });
          pg.end();
        } else {
          currUser = dbres.rows[0].id;
          query = 'SELECT * FROM purchaseorder WHERE buyer = $1';
          value = [currUser];
          pg.query(query, value, function (err, dbresp) {
            if (err) {
              console.error(err);
              res.status(500).json({
                error: {
                  status: 500,
                  message: 'error..'
                }
              });
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
    }
  });
}; // GET A SPECIFIC ORDER


var getAnOrder = function getAnOrder(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      var orderId = req.params.orderid;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect(); // eslint-disable-next-line consistent-return

      var query = 'SELECT * FROM purchaseorder WHERE id = $1';
      var value = [orderId];
      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.log(err);
          res.status(500).json({
            error: {
              message: 'error encountered'
            }
          });
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
    }
  });
}; // PATCH ORDER


var patchOrder = function patchOrder(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          message: 'error..invalid token'
        }
      });
    } else {
      // eslint-disable-next-line prefer-destructuring
      var email = authData.user.email;
      var order = req.body;
      var query;
      var value;
      var currUser;
      var buyer;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          res.status(500).json({
            error: {
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else {
          currUser = dbres.rows[0].id;
          query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
          value = [req.params.id]; // eslint-disable-next-line consistent-return

          pg.query(query, value, function (err, dbresp) {
            if (err) {
              console.error(err);
              res.status(500).json({
                error: {
                  message: 'error..'
                }
              });
              pg.end();
            } else if (dbresp.rows.length === 0) {
              res.status(200).json({
                data: {
                  message: 'No order found'
                }
              });
              pg.end();
            } else {
              // eslint-disable-next-line prefer-destructuring
              buyer = dbresp.rows[0].buyer;

              if (currUser === buyer) {
                query = 'UPDATE purchaseorder SET amount=$1';
                value = [order.amount]; // eslint-disable-next-line consistent-return
                // eslint-disable-next-line no-unused-vars

                pg.query(query, value, function (err, dbresponse) {
                  if (err) {
                    // console.error(err);
                    res.status(500).json({
                      error: {
                        message: 'An error occured, Please check input!!!'
                      }
                    });
                    pg.end();
                  } else {
                    res.status(200).json({
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
    }
  });
}; // DELETE ORDER


var deleteOrder = function deleteOrder(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          message: 'error..invalid token'
        }
      });
    } else {
      var email = authData.user.email;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      var value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: {
              message: 'error..'
            }
          });
          pg.end();
        } else {
          var user = dbres.rows[0].id;
          var order = req.params.id;
          query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
          value = [order];
          pg.query(query, value, function (err, resp) {
            if (err) {
              res.status(500).json({
                error: {
                  message: 'error..'
                }
              });
              console.error(err);
              pg.end();
            } else if (resp.rows[0].buyer === user) {
              query = 'DELETE FROM carads WHERE id = $1';
              value = [order]; // eslint-disable-next-line consistent-return
              // eslint-disable-next-line no-unused-vars

              pg.query(query, value, function (err, resdb) {
                if (err) {
                  res.status(500).json({
                    error: {
                      message: 'error..'
                    }
                  });
                  console.error(err);
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
    }
  });
};

module.exports = {
  getMyOrders: getMyOrders,
  postOrder: postOrder,
  getAnOrder: getAnOrder,
  patchOrder: patchOrder,
  deleteOrder: deleteOrder
};