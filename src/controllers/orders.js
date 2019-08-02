import { Client } from 'pg';

const respondErr = (err, res) => {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered',
    },
  });
};

export const postOrder = (req, res) => {
  const { data } = req;
  const { email } = data.user;
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  let value = [email];
  // eslint-disable-next-line consistent-return
  pg.query(query, value, (err, dbres) => {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      const buyer = dbres.rows[0].id;
      const newOrder = req.body;
      const car_id = req.params.id;
      const { description } = newOrder;
      const amount = newOrder.price_offered;
      const status = 'pending';

      query = 'SELECT * FROM carads WHERE id = $1';
      value = [car_id];
      pg.query(query, value, (err, dbresp) => {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else {
          const image = dbresp.rows[0].image_url;
          const { manufacturer } = dbresp.rows[0];
          const { model } = dbresp.rows[0];
          const car_owner = dbresp.rows[0].owner;
          const priceofCar = dbresp.rows[0].price;
          query = 'INSERT INTO purchaseorder(status, amount, car_id, buyer, description, image, manufacturer, model, car_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          value = [status, amount, car_id, buyer, description, image,
            manufacturer, model, car_owner];
          // eslint-disable-next-line consistent-return
          // PG Query
          pg.query(query, value, (err) => {
            if (err) {
              console.error(err);
              res.status(403).json({
                status: 403,
                error: {
                  message: 'Input error, Please check input!!!',
                },
              });
              pg.end();
            } else {
              const created_on = Date.now();
              res.status(200).json({
                status: 200,
                data: {
                  message: 'Posted successfully',
                  buyer,
                  car_id,
                  created_on,
                  status,
                  priceofCar,
                  manufacturer,
                  model,
                  car_owner,
                  image,
                  amount,
                },
              });
              pg.end();
            }
          });
        }
      });
    }
  });
};

export const getMyOrders = (req, res) => {
  const { data } = req;
  const { email } = data.user;
  console.log(email);
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
      respondErr(err, res);
      pg.end();
    } else {
      currUser = dbres.rows[0].id;
      query = 'SELECT * FROM purchaseorder WHERE buyer = $1';
      value = [currUser];
      pg.query(query, value, (err, dbresp) => {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbresp.rows.length === 0) {
          res.status(200).json({
            data: {
              message: 'No order found',
            },
          });
          pg.end();
        } else {
          const orders = dbresp.rows;
          res.status(200).json({
            data: {
              state: 'success',
              message: 'result completed',
              orders,
            },
          });
          pg.end();
        }
      });
    }
  });
};

// GET A SPECIFIC ORDER
export const getAnOrder = (req, res) => {
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
      respondErr(err, res);
      pg.end();
    } else {
      const order = dbres.rows;
      res.status(200).json({
        data: {
          state: 'success',
          message: 'Success, result completed',
          order,
        },
      });
      pg.end();
    }
  });
};

// PATCH ORDER
export const patchOrder = (req, res) => {
  const { data } = req;
  const { email } = data.user;
  const order = req.body;
  let query;
  let value;
  let currUser;

  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
  value = [email];
  // eslint-disable-next-line consistent-return
  pg.query(query, value, (err, dbres) => {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      currUser = dbres.rows[0].id;

      query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
      value = [req.params.id];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbresp) => {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbresp.rows.length === 0) {
          res.status(200).json({
            status: 200,
            data: {
              message: 'No order found',
            },
          });
          pg.end();
        } else {
          const { buyer } = dbresp.rows[0];
          const priceOffered = order.price_offered;

          if (currUser === buyer) {
            query = 'UPDATE purchaseorder SET amount=$1';
            value = [priceOffered];
            // eslint-disable-next-line consistent-return
            // eslint-disable-next-line no-unused-vars
            pg.query(query, value, (err, dbresponse) => {
              if (err) {
                respondErr(err, res);
                pg.end();
              } else {
                res.status(200).json({
                  status: 200,
                  data: {
                    status: 200,
                    message: 'Order updated successfully!!',
                    order,
                  },
                });
                pg.end();
              }
            });
          } else {
            res.status(403).json({
              error: {
                message: 'You are not permiited to update this ad!!!',
              },
            });
            pg.end();
          }
        }
      });
    }
  });
};

// DELETE ORDER
export const deleteOrder = (req, res) => {
  const { data } = req;
  const { email } = data.user;
  console.log(email);
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  let value = [email];
  // eslint-disable-next-line consistent-return
  pg.query(query, value, (err, dbres) => {
    if (err) {
      respondErr(err, res);
    } else {
      const user = dbres.rows[0].id;
      const order = req.params.id;
      query = 'SELECT buyer FROM purchaseorder WHERE id = $1';
      value = [order];
      pg.query(query, value, (err, resp) => {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (resp.rows[0].buyer === user) {
          query = 'DELETE FROM carads WHERE id = $1';
          value = [order];
          // eslint-disable-next-line consistent-return
          // eslint-disable-next-line no-unused-vars
          pg.query(query, value, (err, resdb) => {
            if (err) {
              respondErr(err, res);
              pg.end();
            } else {
              res.status(200).json({
                data: {
                  status: 200,
                  message: 'AD successfully deleted',
                },
              });
              pg.end();
            }
          });
        } else {
          res.status(403).json({
            error: {
              status: 403,
              message: 'You are not permitted to delete this Ad',
            },
          });
          pg.end();
        }
      });
    }
  });
};
