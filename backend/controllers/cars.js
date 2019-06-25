/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');

const jwt = require('jsonwebtoken');
// const cars = require('../db/Cars.js');

// GET REQUESTS
const getCars = (req, res) => {
  // PRICE-RANGE AND STATUS-AVAILABLE
  if (req.query.min_price && req.query.max_price && req.query.status) {
    const pg = new Client({
      connectionString: process.env.db_URL,
    });
    pg.connect();
    // PG Connect
    // eslint-disable-next-line consistent-return
    const query = 'SELECT * FROM carads WHERE price BETWEEN $1 AND $2 AND status = $3';
    const value = [req.query.min_price, req.query.max_price, 'available'];
    pg.query(query, value, (err, dbres) => {
      console.log(dbres);
      if (err) {
        console.log(err.stack);
        res.status(500).json({
          message: 'error encountered',
        });
      } else if (dbres.rows.length === 0) {
        res.status(404).json({
          message: 'No car found!!',
        });
      } else {
        const carad = dbres.rows;
        res.status(200).json({
          message: 'result completed',
          carad,
        });
      }
    });
  } else {
    const pg = new Client({
      connectionString: process.env.db_URL,
    });
    pg.connect();
    // PG Connect
    // eslint-disable-next-line consistent-return
    const query = 'SELECT * FROM carads WHERE status = $1';
    const value = ['available'];
    pg.query(query, value, (err, dbres) => {
      if (err) {
        console.log(err.stack);
        res.status(500).json({
          message: 'error encountered',
        });
      } else if (dbres.rows.length === 0) {
        res.status(404).json({
          message: 'No car found!!!',
        });
      } else {
        const carad = dbres.rows;
        res.status(200).json({
          message: 'result completed',
          carad,
        });
      }
    });
  }
};

// GET SPECIFIC CAR
const getCar = (req, res) => {
  const ad = req.params;
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  pg.connect();
  // PG Connect
  // eslint-disable-next-line consistent-return
  const query = 'SELECT * FROM carads WHERE id = $1';
  const value = [ad.id];

  pg.query(query, value, (err, dbres) => {
    console.log(dbres);
    if (err) {
      console.log(err.stack);
      res.status(500).json({
        message: 'error encountered',
      });
    } else if (dbres.rows.length === 0) {
      res.status(404).json({
        message: 'No car found!!',
      });
    } else {
      const carad = dbres.rows;
      res.status(200).json({
        message: 'result completed',
        carad,
      });
    }
  });
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
      const value = [newAd.status, newAd.price, newAd.manufacturer,
        newAd.model, newAd.body_type, newAd.owner];
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

// PATCH CAR AD
const patchCar = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid token',
      });
    } else {
      const ad = req.body;
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      // PG Connect
      pg.connect();

      const query = 'UPDATE carads SET status=$1, price=$2 WHERE owner = $3 AND id = $4';
      const value = [ad.status, ad.price, ad.owner, ad.id];
      // eslint-disable-next-line consistent-return
      // PG Query
      // eslint-disable-next-line no-unused-vars
      pg.query(query, value, (err, dbres) => {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'An error occured, Please check input!!!',
          });
        } else if (dbres.rowCount === 0) {
          res.status(403).json({
            message: 'You are not permiited to update this ad!!!',
          });
        } else {
          res.status(200).json({
            message: 'AD Updated successfully',
            ad,
          });
        }
      });
    }
  });
};

// DELETE CAR
const deleteCar = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    console.log(authData);
    const email = authData.user.email;
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token',
      });
    }
    const pg = new Client({
      connectionString: process.env.db_URL,
    });
    // PG Connect
    pg.connect();
    let query = 'SELECT * FROM users WHERE email = $1';
    let value = [email];
    console.log(value);
    // eslint-disable-next-line consistent-return
    // PG Query
    // eslint-disable-next-line no-unused-vars
    pg.query(query, value, (err, dbres) => {
      console.log(dbres);
      if (err) {
        console.error(err);
      } else if (dbres.rows[0].is_admin === false) {
        res.status(403).json({
          message: 'You are not permitted to delete this Ad!!!',
        });
      } else {
        query = 'DELETE FROM carads WHERE id = $1';
        value = [req.params.id];
        // eslint-disable-next-line consistent-return
        // PG Query
        // eslint-disable-next-line no-unused-vars
        pg.query(query, value, (err, resdb) => {
          if (err) {
            console.error(err);
          } else if (resdb.rowCount === 0) {
            res.status(403).json({
              message: 'Ad not found!!',
            });
          } else {
            res.status(200).json({
              message: 'AD successfully deleted',
            });
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
