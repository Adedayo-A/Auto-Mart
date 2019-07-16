"use strict";

/* eslint-disable prefer-destructuring */

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var _require = require('pg'),
    Client = _require.Client;

var jwt = require('jsonwebtoken'); // GET REQUESTS


var getCars = function getCars(req, res) {
  // PRICE-RANGE AND STATUS-AVAILABLE
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
        message: 'invalid token!!!'
      });
    } else if (req.query.min_price && req.query.max_price && req.query.status) {
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect(); // PG Connect
      // eslint-disable-next-line consistent-return

      var query = 'SELECT * FROM carads WHERE price BETWEEN $1 AND $2 AND LOWER(status) = LOWER($3)';
      var value = [req.query.min_price, req.query.max_price, 'available'];
      pg.query(query, value, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!'
          });
          pg.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad: carad
          });
          pg.end();
        }
      });
    } else if (req.query.state && req.query.status) {
      var _pg = new Client({
        connectionString: process.env.db_URL
      });

      _pg.connect(); // PG Connect
      // eslint-disable-next-line consistent-return


      var _query = 'SELECT * FROM carads WHERE LOWER(status)=LOWER($1) AND LOWER(state)=LOWER($2)';
      var _value = ['available', req.query.state];

      _pg.query(_query, _value, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });

          _pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!'
          });

          _pg.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad: carad
          });

          _pg.end();
        }
      });
    } else if (req.query.status) {
      var _pg2 = new Client({
        connectionString: process.env.db_URL
      });

      _pg2.connect(); // PG Connect
      // eslint-disable-next-line consistent-return


      var _query2 = 'SELECT * FROM carads WHERE LOWER(status) = LOWER($1)';
      var _value2 = ['available'];

      _pg2.query(_query2, _value2, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });

          _pg2.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!'
          });

          _pg2.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad: carad
          });

          _pg2.end();
        }
      });
    } else if (req.query.body_type) {
      var _pg3 = new Client({
        connectionString: process.env.db_URL
      });

      _pg3.connect(); // eslint-disable-next-line consistent-return


      var _query3 = 'SELECT * FROM carads WHERE LOWER(body_type) = LOWER($1)';
      var _value3 = [req.query.body_type];

      _pg3.query(_query3, _value3, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });

          _pg3.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!'
          });

          _pg3.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad: carad
          });

          _pg3.end();
        }
      });
    } else if (req.query.manufacturer) {
      var _pg4 = new Client({
        connectionString: process.env.db_URL
      });

      _pg4.connect(); // eslint-disable-next-line consistent-return


      var _query4 = 'SELECT * FROM carads WHERE LOWER(manufacturer) = LOWER($1) AND LOWER(status)=LOWER($2)';
      var _value4 = [req.query.manufacturer, req.query.status];

      _pg4.query(_query4, _value4, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });

          _pg4.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!!'
          });

          _pg4.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'result completed',
            carad: carad
          });

          _pg4.end();
        }
      });
    } else {
      var email = authData.user.email;

      var _pg5 = new Client({
        connectionString: process.env.db_URL
      });

      _pg5.connect();

      var _query5 = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      var _value5 = [email]; // eslint-disable-next-line consistent-return

      _pg5.query(_query5, _value5, function (err, dbres) {
        if (err) {
          console.error(err);
        } else if (dbres.rows[0].is_admin === false) {
          res.status(403).json({
            message: 'Access Denied!!!'
          });

          _pg5.end();
        } else {
          _query5 = 'SELECT * FROM LOWER(carads)';

          _pg5.query(_query5, function (err, resdb) {
            if (err) {// console.error(err);
            } else if (resdb.rows.length === 0) {
              res.status(404).json({
                message: 'No ads present!'
              });

              _pg5.end();
            } else {
              var carad = resdb.rows;
              res.status(200).json({
                message: 'result completed',
                carad: carad
              });

              _pg5.end();
            }
          });
        }
      });
    }
  });
}; // GET SPECIFIC CAR


var getCar = function getCar(req, res) {
  var ad = req.params;
  jwt.verify(req.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.status(403).json({
        message: 'error..invalid Token'
      });
    } else {
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect(); // eslint-disable-next-line consistent-return

      var query = 'SELECT * FROM carads WHERE id = $1';
      var value = [ad.id];
      pg.query(query, value, function (err, dbres) {
        if (err) {
          // console.log(err.stack);
          res.status(500).json({
            message: 'error encountered'
          });
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            message: 'No car found!!'
          });
          pg.end();
        } else {
          var carad = dbres.rows;
          res.status(200).json({
            message: 'Success, result completed',
            carad: carad
          });
          pg.end();
        }
      });
    }
  });
}; // POST CAR


var postCar = function postCar(req, res) {
  var newAd = req.body;
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
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
          pg.end();
        } else if (dbres.rows[0].first_name === null) {
          res.status(200).json({
            message: 'Please complete your registration inorder to post a car!!'
          });
          pg.end();
        } else {
          query = 'INSERT INTO carads(status, price, manufacturer, model, body_type, owner, state) VALUES($1, $2, $3, $4, $5, $6, $7)';
          value = [newAd.status, newAd.price, newAd.manufacturer, newAd.model, newAd.body_type, newAd.owner, newAd.state]; // eslint-disable-next-line consistent-return
          // PG Query
          // eslint-disable-next-line no-unused-vars

          pg.query(query, value, function (err, dbRes) {
            if (err) {
              // console.error(err);
              res.status(403).json({
                message: 'Input error, Please check input!!!',
                newAd: newAd
              });
              pg.end();
            } else {
              res.status(200).json({
                message: 'Posted successfully',
                newAd: newAd
              });
              pg.end();
            }
          });
        }
      });
    }
  });
}; // PATCH CAR AD


var patchCar = function patchCar(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var email = authData.user.email;

    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      var ad = req.body;
      var query;
      var value;
      var currUser;
      var owner;
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

        query = 'SELECT owner FROM carads WHERE id = $1';
        value = [req.params.id]; // eslint-disable-next-line consistent-return
        // eslint-disable-next-line no-shadow

        pg.query(query, value, function (err, dbres) {
          if (err) {
            console.error(err);
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              message: 'No ad found'
            });
            pg.end();
          } else {
            owner = dbres.rows[0].owner;
          }

          if (currUser === owner) {
            query = 'UPDATE carads SET status=$1, price=$2';
            value = [ad.status, ad.price]; // eslint-disable-next-line consistent-return
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
                  message: 'AD updated successfully!!',
                  ad: ad
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
}; // DELETE CAR


var deleteCar = function deleteCar(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var email = authData.user.email;

    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    }

    var pg = new Client({
      connectionString: process.env.db_URL
    });
    pg.connect();
    var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    var value = [email]; // eslint-disable-next-line consistent-return

    pg.query(query, value, function (err, dbres) {
      if (err) {
        console.error(err);
        pg.end();
      } else if (dbres.rows[0].is_admin === false) {
        res.status(403).json({
          message: 'You are not permitted to delete this Ad!!!'
        });
        pg.end();
      } else {
        query = 'DELETE FROM carads WHERE id = $1';
        value = [req.params.id]; // eslint-disable-next-line consistent-return
        // eslint-disable-next-line no-unused-vars

        pg.query(query, value, function (err, resdb) {
          if (err) {
            console.error(err);
            pg.end();
          } else if (resdb.rowCount === 0) {
            res.status(200).json({
              message: 'Ad not found!!'
            });
            pg.end();
          } else {
            res.status(200).json({
              message: 'AD successfully deleted'
            });
            pg.end();
          }
        });
      }
    });
  });
};

module.exports = {
  getCars: getCars,
  getCar: getCar,
  postCar: postCar,
  patchCar: patchCar,
  deleteCar: deleteCar
};