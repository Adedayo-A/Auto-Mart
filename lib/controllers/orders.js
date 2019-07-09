const jwt = require('jsonwebtoken'); // eslint-disable-next-line import/no-extraneous-dependencies


const {
  Client
} = require('pg'); // const cars = require('../db/Cars.js');
// const orders = require('../db/Orders.js');


const postOrder = (req, res) => {
  const newOrder = req.body; // eslint-disable-next-line no-unused-vars

  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token'
      });
    } else {
      newOrder.status = 'pending';
      const pg = new Client({
        connectionString: process.env.db_URL
      }); // PG Connect

      pg.connect();
      const query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer) VALUES($1, $2, $3, $4)';
      const value = [newOrder.status, newOrder.amount, newOrder.car_id, newOrder.buyer]; // eslint-disable-next-line consistent-return
      // PG Query

      pg.query(query, value, (err, dbRes) => {
        if (err) {
          // console.error(err);
          res.status(403).json({
            message: 'Input error, Please check input!!!',
            newOrder
          });
        } else {
          res.status(200).json({
            message: 'Posted successfully',
            newOrder
          });
          pg.end();
        }
      });
    }
  });
};

const patchOrder = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    // eslint-disable-next-line prefer-destructuring
    const email = authData.user.email;

    if (err) {
      res.status(403).json({
        message: 'error..invalid Token'
      });
    } else {
      const order = req.body;
      let query;
      let value;
      let currUser;
      let buyer;
      const pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
        } else {
          currUser = dbres.rows[0].id;
        }

        query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
        value = [req.params.id]; // eslint-disable-next-line consistent-return

        pg.query(query, value, (err, dbresp) => {
          if (err) {
            console.error(err);
          } else if (dbresp.rows.length === 0) {
            res.status(200).json({
              message: 'No order found'
            });
          } else {
            // eslint-disable-next-line prefer-destructuring
            buyer = dbresp.rows[0].buyer;
          }

          if (currUser === buyer) {
            query = 'UPDATE purchaseorder SET amount=$1';
            value = [order.amount]; // eslint-disable-next-line consistent-return
            // eslint-disable-next-line no-unused-vars

            pg.query(query, value, (err, dbresponse) => {
              if (err) {
                // console.error(err);
                res.status(403).json({
                  message: 'An error occured, Please check input!!!'
                });
              } else {
                res.status(200).json({
                  message: 'Order updated successfully!!',
                  order
                });
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
  postOrder,
  patchOrder
};