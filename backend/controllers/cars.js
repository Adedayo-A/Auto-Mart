/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');

const jwt = require('jsonwebtoken');

// GET REQUESTS
const getCars = (req, res) => {
  // PRICE-RANGE AND STATUS-AVAILABLE
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'invalid token!!!',
      });
    } else if (req.query.min_price && req.query.max_price && req.query.status) {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // PG Connect
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE price BETWEEN $1 AND $2 AND LOWER(status) = LOWER($3)';
      const value = [req.query.min_price, req.query.max_price, 'available'];
      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad,
          });
          pg.end();
        }
      });
    } else if (req.query.state && req.query.status) {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // PG Connect
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE LOWER(status)=LOWER($1) AND LOWER(state)=LOWER($2)';
      const value = ['available', req.query.state];
      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad,
          });
          pg.end();
        }
      });
    } else if (req.query.status) {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // PG Connect
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE LOWER(status) = LOWER($1)';
      const value = ['available'];
      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad,
          });
          pg.end();
        }
      });
    } else if (req.query.body_type) {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE LOWER(body_type) = LOWER($1)';
      const value = [req.query.body_type];
      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad,
          });
          pg.end();
        }
      });
    } else if (req.query.manufacturer) {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE LOWER(manufacturer) = LOWER($1) AND LOWER(status)=LOWER($2)';
      const value = [req.query.manufacturer, req.query.status];
      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad,
          });
          pg.end();
        }
      });
    } else {
      const email = authData.user.email;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      const value = [email];
      // eslint-disable-next-line consistent-return
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
        } else if (dbres.rows[0].is_admin === false) {
          res.status(403).json({
            message: 'Access Denied!!!',
          });
          pg.end();
        } else {
          query = 'SELECT * FROM LOWER(carads)';
          pg.query(query, (err, resdb) => {
            if (err) {
              // console.error(err);
            } else if (resdb.rows.length === 0) {
              res.status(404).json({
                message: 'No ads present!',
              });
              pg.end();
            } else {
              const carad = resdb.rows;
              res.status(200).json({
                message: 'result completed',
                carad,
              });
              pg.end();
            }
          });
        }
      });
    }
  });
};

// GET SPECIFIC CAR
const getCar = (req, res) => {
  const ad = req.params;
  jwt.verify(req.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token',
      });
    } else {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      pg.connect();
      // eslint-disable-next-line consistent-return
      const query = 'SELECT * FROM carads WHERE id = $1';
      const value = [ad.id];

      pg.query(query, value, (err, dbres) => {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered',
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!',
          });
          pg.end();
        } else {
          const carad = dbres.rows;
          res.status(200).json({
            message: 'Success, result completed',
            carad,
          });
          pg.end();
        }
      });
    }
  });
};

// POST CAR
const postCar = (req, res) => {
  const newAd = req.body;
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
        } else if (dbres.rows[0].first_name === null) {
          res.status(200).json({
            message: 'Please complete your registration inorder to post a car!!',
          });
          pg.end();
        } else {
          query = 'INSERT INTO carads(status, price, manufacturer, model, body_type, owner, state) VALUES($1, $2, $3, $4, $5, $6, $7)';
          value = [newAd.status, newAd.price, newAd.manufacturer,
            newAd.model, newAd.body_type, newAd.owner, newAd.state];
          // eslint-disable-next-line consistent-return
          // PG Query
          // eslint-disable-next-line no-unused-vars
          pg.query(query, value, (err, dbRes) => {
            if (err) {
            // console.error(err);
              res.status(403).json({
                message: 'Input error, Please check input!!!',
                newAd,
              });
              pg.end();
            } else {
              res.status(200).json({
                message: 'Posted successfully',
                newAd,
              });
              pg.end();
            }
          });
        }
      });
    }
  });
};

// PATCH CAR AD
const patchCar = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    const email = authData.user.email;
    if (err) {
      res.status(403).json({
        message: 'error..invalid token',
      });
    } else {
      const ad = req.body;
      let query;
      let value;
      let currUser;
      let owner;

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
        }
        query = 'SELECT owner FROM carads WHERE id = $1';
        value = [req.params.id];
        // eslint-disable-next-line consistent-return
        // eslint-disable-next-line no-shadow
        pg.query(query, value, (err, dbres) => {
          if (err) {
            console.error(err);
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              message: 'No ad found',
            });
            pg.end();
          } else {
            owner = dbres.rows[0].owner;
          }

          if (currUser === owner) {
            query = 'UPDATE carads SET status=$1, price=$2';
            value = [ad.status, ad.price];
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
                  message: 'AD updated successfully!!',
                  ad,
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
        });
      });
    }
  });
};

// DELETE CAR
const deleteCar = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    const email = authData.user.email;
    if (err) {
      res.status(403).json({
        message: 'error..invalid token',
      });
    }
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
      } else if (dbres.rows[0].is_admin === false) {
        res.status(403).json({
          message: 'You are not permitted to delete this Ad!!!',
        });
        pg.end();
      } else {
        query = 'DELETE FROM carads WHERE id = $1';
        value = [req.params.id];
        // eslint-disable-next-line consistent-return
        // eslint-disable-next-line no-unused-vars
        pg.query(query, value, (err, resdb) => {
          if (err) {
            console.error(err);
            pg.end();
          } else if (resdb.rowCount === 0) {
            res.status(200).json({
              message: 'Ad not found!!',
            });
            pg.end();
          } else {
            res.status(200).json({
              message: 'AD successfully deleted',
            });
            pg.end();
          }
        });
      }
    });
  });
};

module.exports = {
  getCars,
  getCar,
  postCar,
  patchCar,
  deleteCar,
};
