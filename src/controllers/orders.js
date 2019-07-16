const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');
// const cars = require('../db/Cars.js');
// const orders = require('../db/Orders.js');

const postOrder = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(401).json({
        status: 401,
        message: 'error..invalid Token',
      });
    } else {
      const newOrder = req.body;
      const carId = req.params.id;
      const { description } = newOrder;
      const email = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      let value = [email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          const status = 'pending';
          const buyer = dbres.rows[0].id;
          query = 'SELECT * FROM carads WHERE id = $1';
          value = [carId];
          pg.query(query, value, (err, dbresp) => {
            if (err) {
              console.log(err);
              pg.end();
            } else {
              const image = dbresp.rows[0].image_url;
              const manufacturer = dbresp.rows[0].manufacturer;
              const model = dbresp.rows[0].model;
              const carowner = dbresp.rows[0].owner;
              query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer, description, image, manufacturer, model, car_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
              value = [status, newOrder.amount, carId, buyer, description, image, manufacturer, model, carowner];
              // eslint-disable-next-line consistent-return
              // PG Query
              pg.query(query, value, (err) => {
                if (err) {
                  console.error(err);
                  res.status(403).json({
                    status: 403,
                    message: 'Input error, Please check input!!!',
                    new_order,
                  });
                  pg.end();
                } else {
                  res.status(200).json({
                    status: 200,
                    message: 'Posted successfully',
                    new_order,
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

const getMyOrders = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(401).json({
        status: 401,
        message: 'error..invalid Token',
      });
    } else {
    // eslint-disable-next-line prefer-destructuring
      const email = authData.user.email;
      let query;
      let value;
      let currUser;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          currUser = dbres.rows[0].id;
          query = 'SELECT * FROM purchaseorder WHERE buyer = $1';
          value = [currUser];
          console.log('this is current '+ currUser);
          pg.query(query, value, (err, dbresp) => {
            if (err) {
              console.error(err);
              pg.end();
            } else if (dbresp.rows.length === 0) {
              res.status(200).json({
                message: 'No order found',
              });
              pg.end();
            } else {
              const orders = dbresp.rows;
              console.log('this is order '+ orders);
              res.status(200).json({
                state: 'success',
                message: 'result completed',
                orders,
              });
              pg.end();
            }           
          });
        }
      });
    }
  });
};

// GET A SPECIFIC ORDER
const getAnOrder = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(401).json({
        status: 401,
        message: 'error..invalid Token',
      });
    } else {
      const orderId = req.params.orderid;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM purchaseorder WHERE id = $1';
      const value = [orderId];

      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else {
          const order = dbres.rows;
          res.status(200).json({
            state: 'success',
            message: 'Success, result completed',
            order,
          });
          pg.end();
        }
      });
    }
  });
};

// PATCH ORDER
const patchOrder = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token',
      });
    } else {
    // eslint-disable-next-line prefer-destructuring
      const email = authData.user.email;
      const order = req.body;
      let query;
      let value;
      let currUser;
      let buyer;

      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          console.log(dbres);
          currUser = dbres.rows[0].id;
        
          query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
          value = [req.params.id];
          // eslint-disable-next-line consistent-return
          pg.query(query, value, (err, dbresp) => {
            if (err) {
              console.error(err);
              pg.end();
            } else if (dbresp.rows.length === 0) {
              res.status(200).json({
                message: 'No order found',
              });
              pg.end();
            } else {
              // eslint-disable-next-line prefer-destructuring
              buyer = dbresp.rows[0].buyer;
            
              if (currUser === buyer) {
                query = 'UPDATE purchaseorder SET amount=$1';
                value = [order.amount];
                // eslint-disable-next-line consistent-return
                // eslint-disable-next-line no-unused-vars
                pg.query(query, value, (err, dbresponse) => {
                  if (err) {
                    // console.error(err);
                    res.status(403).json({
                      message: 'An error occured, Please check input!!!',
                    });
                    pg.end();
                  } else {
                    res.status(200).json({
                      status: 200,
                      message: 'Order updated successfully!!',
                      order,
                    });
                    pg.end();
                  }
                });
              } else {
                res.status(403).json({
                  message: 'You are not permiited to update this ad!!!',
                });
                pg.end();
              }
            }
          });
        }
      });
    }
  });
};

// DELETE ORDER
const deleteOrder = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid token',
      });
    } else {
      const email = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      let value = [email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          pg.end();
        } else {
          const user = dbres.rows[0].id;
          const order = req.params.id;
          query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
          value = [order];
          pg.query(query, value, (err, resp) => {
            if (err) {
              console.error(err);
              pg.end();
            } else if (resp.rows[0].buyer === user) {
              query = 'DELETE FROM carads WHERE id = $1';
              value = [order];
              // eslint-disable-next-line consistent-return
              // eslint-disable-next-line no-unused-vars
              pg.query(query, value, (err, resdb) => {
                if (err) {
                  console.error(err);
                  pg.end();
                } else {
                  res.status(200).json({
                    status: 200,
                    message: 'AD successfully deleted',
                  });
                  pg.end();
                }
              });
            } else {
              res.status(403).json({
                status: 403,
                message: 'You are not permitted to delete this Ad',
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
  getMyOrders,
  postOrder,
  getAnOrder,
  patchOrder,
  deleteOrder,
};
