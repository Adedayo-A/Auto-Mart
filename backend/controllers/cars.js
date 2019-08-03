"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCarOrders = exports.getACarOrder = exports.getCarOrders = exports.deleteCar = exports.patchCar = exports.postCar = exports.getadsByOwner = exports.getCar = exports.getCars = void 0;

var _pg = require("pg");

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var respondErr = function respondErr(err, res) {
  console.log(err);
  res.json({
    status: 500,
    error: {
      message: 'error encountered'
    }
  });
};

var responseSuccess = function responseSuccess(res, car_ad) {
  res.json({
    status: 200,
    data: {
      status: 200,
      state: 'success',
      message: 'result completed',
      car_ad: car_ad
    }
  });
};

var nocarfound = function nocarfound(res) {
  res.json({
    status: 200,
    data: {
      message: 'No car found!!!'
    }
  });
}; // GET REQUESTS


var getCars = function getCars(req, res) {
  var data = req.data; // PRICE-RANGE AND STATUS-AVAILABLE

  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();

  var pgCallback = function pgCallback(err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else if (dbres.rows.length === 0) {
      nocarfound(res);
      pg.end();
    } else {
      responseSuccess(res, dbres.rows);
      pg.end();
    }
  };

  if (req.query.min_price && req.query.max_price && req.query.status) {
    // eslint-disable-next-line consistent-return
    var query = 'SELECT * FROM carads WHERE price BETWEEN $1 AND $2 AND LOWER(status) = LOWER($3)';
    var value = [req.query.min_price, req.query.max_price, 'available'];
    pg.query(query, value, pgCallback);
  } else if (req.query.state && req.query.status) {
    // eslint-disable-next-line consistent-return
    var _query = 'SELECT * FROM carads WHERE LOWER(status)=LOWER($1) AND LOWER(state)=LOWER($2)';
    var _value = ['available', req.query.state];
    pg.query(_query, _value, pgCallback);
  } else if (req.query.manufacturer && req.query.state) {
    // eslint-disable-next-line consistent-return
    var _query2 = 'SELECT * FROM carads WHERE LOWER(manufacturer)=LOWER($1) AND LOWER(state)=LOWER($2)';
    var _value2 = [req.query.manufacturer, req.query.state];
    pg.query(_query2, _value2, pgCallback);
  } else if (req.query.status) {
    // eslint-disable-next-line consistent-return
    if (req.query.status === 'sold') {
      var email = data.user.email;
      var _query3 = 'SELECT is_admin FROM users WHERE LOWER(email) = LOWER($1)';
      var _value3 = [email]; // eslint-disable-next-line consistent-return

      pg.query(_query3, _value3, function (err, dbres) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (!dbres.rows[0].is_admin) {
          var car_ad = [];
          res.status(200).json({
            status: 200,
            data: {
              state: 'success',
              message: 'result completed!!',
              car_ad: car_ad
            }
          });
          pg.end();
        } else {
          _query3 = 'SELECT * FROM carads WHERE LOWER(status) = LOWER($1)';
          _value3 = [req.query.status];
          pg.query(_query3, _value3, pgCallback);
        }
      });
    } else {
      var _query4 = 'SELECT * FROM carads WHERE LOWER(status) = LOWER($1)';
      var _value4 = [req.query.status];
      pg.query(_query4, _value4, pgCallback);
    }
  } else if (req.query.body_type) {
    var _query5 = 'SELECT * FROM carads WHERE LOWER(body_type)=LOWER($1) AND status=LOWER($2)';
    var _value5 = [req.query.body_type, 'available'];
    pg.query(_query5, _value5, pgCallback);
  } else if (req.query.manufacturer) {
    console.log(req.query.manufacturer); // eslint-disable-next-line consistent-return

    var _query6 = 'SELECT * FROM carads WHERE LOWER(manufacturer) = LOWER($1) AND LOWER(status)=LOWER($2)';
    var _value6 = [req.query.manufacturer, 'available'];
    pg.query(_query6, _value6, pgCallback);
  } else {
    var _email = data.user.email;
    var _query7 = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    var _value7 = [_email]; // eslint-disable-next-line consistent-return

    pg.query(_query7, _value7, function (err, dbres) {
      if (err) {
        respondErr(err, res);
        pg.end();
      } else if (dbres.rows[0].is_admin === false) {
        res.status(403).json({
          error: {
            message: 'Access Denied!!!'
          }
        });
        pg.end();
      } else {
        _query7 = 'SELECT * FROM carads';
        pg.query(_query7, _value7, pgCallback);
      }
    });
  }
}; // GET SPECIFIC CAR


exports.getCars = getCars;

var getCar = function getCar(req, res) {
  var ad = req.params;
  console.log(ad);
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect(); // eslint-disable-next-line consistent-return

  var query = 'SELECT * FROM carads WHERE id = $1';
  var value = [ad.id];
  pg.query(query, value, function (err, dbres) {
    console.log(dbres);

    if (err) {
      respondErr(err, res);
      pg.end();
    } else if (dbres.rows === 0) {
      res.status(200).json({
        status: 200,
        data: {
          message: 'No car found!!'
        }
      });
      pg.end();
    } else {
      var car_ad = dbres.rows;
      res.status(200).json({
        status: 200,
        data: {
          state: 'success',
          message: 'Success, result completed',
          car_ad: car_ad
        }
      });
      pg.end();
    }
  });
}; // GET ADS BY A OWNER


exports.getCar = getCar;

var getadsByOwner = function getadsByOwner(req, res) {
  var data = req.data;
  var email = data.user.email;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  var query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
  var value = [email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      var owner = dbres.rows[0].id;
      query = 'SELECT * FROM carads WHERE owner = $1';
      value = [owner];
      pg.query(query, value, function (err, dbres) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            status: 200,
            data: {
              message: 'No car found!!'
            }
          });
          pg.end();
        } else {
          var car_ad = dbres.rows;
          res.status(200).json({
            status: 200,
            data: {
              state: 'success',
              message: 'Success, result completed',
              car_ad: car_ad
            }
          });
          pg.end();
        }
      });
    }
  });
}; // POST CAR


exports.getadsByOwner = getadsByOwner;

var postCar = function postCar(req, res) {
  var data = req.data;
  var newAd = req.body;
  var created_on = Date.now();
  var price = newAd.price;
  var door = newAd.door;
  door = door || null;
  var image_url = newAd.image_url;
  image_url = image_url || '';
  var owner;
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
    } else if (dbres.rows[0].first_name === null) {
      res.status(403).json({
        status: 403,
        error: {
          message: 'Please complete your registration inorder to post a car!!'
        }
      });
      pg.end();
    } else {
      owner = dbres.rows[0].id;
      query = 'INSERT INTO carads(status, price, manufacturer, model, body_type, owner, state, ext_col, int_col, transmission, mileage, door, description, image_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
      value = [newAd.status, price, newAd.manufacturer, newAd.model, newAd.body_type, owner, newAd.state, newAd.ext_col, newAd.int_col, newAd.transmission, newAd.mileage, door, newAd.description, image_url];
      pg.query(query, value, function (err, dbRes) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else {
          var id = owner;
          var manufacturer = newAd.manufacturer;
          var model = newAd.model;
          res.json({
            status: 200,
            data: {
              state: 'success',
              message: 'Posted successfully',
              id: id,
              email: email,
              created_on: created_on,
              manufacturer: manufacturer,
              model: model
            }
          });
          pg.end();
        }
      });
    }
  });
}; // PATCH CAR AD


exports.postCar = postCar;

var patchCar = function patchCar(req, res) {
  var data = req.data;
  var email = data.user.email;
  var adId = req.params.id;
  var ad = req.body;
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
      query = 'SELECT owner FROM carads WHERE id = $1';
      value = [adId]; // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-shadow

      pg.query(query, value, function (err, dbres) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (dbres.rows.length === 0) {
          res.status(200).json({
            status: 200,
            data: {
              message: 'No ad found'
            }
          });
          pg.end();
        } else {
          var owner = dbres.rows[0].owner;

          if (currUser === owner) {
            query = 'UPDATE carads SET status=$1, price=$2 WHERE id=$3';
            value = [ad.status, ad.price, adId]; // eslint-disable-next-line consistent-return
            // eslint-disable-next-line no-unused-vars

            pg.query(query, value, function (err, dbresponse) {
              if (err) {
                respondErr(err, res);
                pg.end();
              } else {
                res.status(200).json({
                  status: 200,
                  data: {
                    state: 'success',
                    status: 200,
                    message: 'AD updated successfully!!',
                    ad: ad
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
}; // DELETE CAR


exports.patchCar = patchCar;

var deleteCar = function deleteCar(req, res) {
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
    } else if (dbres.rows[0].is_admin === false) {
      res.status(403).json({
        status: 403,
        error: {
          message: 'You are not permitted to delete this Ad!!!'
        }
      });
      pg.end();
    } else {
      query = 'DELETE FROM carads WHERE id = $1';
      value = [req.params.id]; // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, function (err, resdb) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (resdb.rowCount === 0) {
          res.status(200).json({
            status: 200,
            data: {
              message: 'Ad not found!!'
            }
          });
          pg.end();
        } else {
          res.status(200).json({
            status: 200,
            data: {
              message: 'AD successfully deleted'
            }
          });
          pg.end();
        }
      });
    }
  });
}; // GET MY CAR ORDERS


exports.deleteCar = deleteCar;

var getCarOrders = function getCarOrders(req, res) {
  var data = req.data;
  var email = data.user.email;
  var curruser;
  var query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
  var value = [email];
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  pg.query(query, value, function (err, resdb) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      curruser = resdb.rows[0].id;
      query = 'SELECT * FROM purchaseorder WHERE car_owner = $1';
      value = [curruser];
      pg.query(query, value, function (err, respo) {
        // console.log(respo);
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (respo.rows.length === 0) {
          res.status(200).json({
            status: 200,
            data: {
              state: 'success',
              status: 200,
              message: 'you do not have car orders yet'
            }
          });
          pg.end();
        } else {
          var mycar_orders = respo.rows;
          res.status(200).json({
            status: 200,
            data: {
              state: 'success',
              status: 200,
              message: 'orders retrieved',
              mycar_orders: mycar_orders
            }
          });
          pg.end();
        }
      });
    }
  });
}; // GET A CAR ORDER


exports.getCarOrders = getCarOrders;

var getACarOrder = function getACarOrder(req, res) {
  var data = req.data;
  var email = data.user.email;
  var curruser;
  var query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
  var value = [email];
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  pg.query(query, value, function (err, resdb) {
    if (err) {
      res.status(500).json({
        status: 500,
        error: {
          message: 'error..'
        }
      });
      pg.end();
    } else {
      curruser = resdb.rows[0].id;
      query = 'SELECT car_owner FROM purchaseorder WHERE id = $1';
      value = [req.params.id];
      pg.query(query, value, function (err, respo) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (respo.rows[0].car_owner === curruser) {
          query = 'SELECT * FROM purchaseorder WHERE id = $1';
          value = [req.params.id];
          pg.query(query, value, function (err, response) {
            // console.log(respo);
            if (err) {
              respondErr(err, res);
              pg.end();
            } else {
              var car_ord = response.rows[0];
              res.status(200).json({
                status: 200,
                data: {
                  state: 'success',
                  message: 'order retrieved',
                  car_ord: car_ord
                }
              });
              pg.end();
            }
          });
        } else {
          res.status(401).json({
            status: 401,
            error: {
              message: 'not permitted..'
            }
          });
          pg.end();
        }
      });
    }
  });
}; // UPDATE MY CAR ORDERS


exports.getACarOrder = getACarOrder;

var updateCarOrders = function updateCarOrders(req, res) {
  var data = req.data;
  var email = data.user.email;
  var query = 'SELECT id FROM users WHERE email = $1';
  var value = [email];
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  pg.query(query, value, function (err, resdb) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      var curruser = resdb.rows[0].id;
      var orderid = req.params.id;
      var status = req.body.status;
      query = 'SELECT car_owner FROM purchaseorder WHERE id = $1';
      value = [orderid];
      pg.query(query, value, function (err, resdbo) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (resdbo.rows[0].car_owner !== curruser) {
          res.status(401).json({
            status: 401,
            error: {
              message: 'You are not permitted to update this ad..'
            }
          });
          pg.end();
        } else {
          query = 'UPDATE purchaseorder SET status=LOWER($1) WHERE id = $2';
          value = [status, orderid];
          pg.query(query, value, function (err, dbres) {
            // const result = dbres.rows[0];/
            if (err) {
              respondErr(err, res);
              pg.end();
            } else {
              res.json({
                status: 200,
                data: {
                  message: 'Order Updated'
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

exports.updateCarOrders = updateCarOrders;