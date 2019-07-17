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
      res.status(401).json({
        data: {
          status: 401,
          message: 'invalid token!!!'
        }
      });
    } else {
      // PG Connect
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();

      if (req.query.min_price && req.query.max_price && req.query.status) {
        // eslint-disable-next-line consistent-return
        var query = 'SELECT * FROM carads WHERE price BETWEEN $1 AND $2 AND LOWER(status) = LOWER($3)';
        var value = [req.query.min_price, req.query.max_price, 'available'];
        pg.query(query, value, function (err, dbres) {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: {
                message: 'error encountered'
              }
            });
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              data: {
                message: 'No car found!!'
              }
            });
            pg.end();
          } else {
            var car_ad = dbres.rows;
            res.status(200).json({
              data: {
                state: 'success',
                message: 'result completed',
                car_ad: car_ad
              }
            });
            pg.end();
          }
        });
      } else if (req.query.state && req.query.status) {
        // eslint-disable-next-line consistent-return
        var _query = 'SELECT * FROM carads WHERE LOWER(status)=LOWER($1) AND LOWER(state)=LOWER($2)';
        var _value = ['available', req.query.state];
        pg.query(_query, _value, function (err, dbres) {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: {
                message: 'error encountered'
              }
            });
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              data: {
                message: 'No car found!!!'
              }
            });
            pg.end();
          } else {
            var car_ad = dbres.rows;
            res.status(200).json({
              data: {
                state: 'success',
                message: 'result completed',
                car_ad: car_ad
              }
            });
            pg.end();
          }
        });
      } else if (req.query.status) {
        // eslint-disable-next-line consistent-return
        var _query2 = 'SELECT * FROM carads WHERE LOWER(status) = LOWER($1)';
        var _value2 = ['available'];
        pg.query(_query2, _value2, function (err, dbres) {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: {
                message: 'error encountered'
              }
            });
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              data: {
                message: 'No car found!!!'
              }
            });
            pg.end();
          } else {
            var car_ad = dbres.rows;
            res.status(200).json({
              data: {
                state: 'success',
                message: 'result completed',
                car_ad: car_ad
              }
            });
            pg.end();
          }
        });
      } else if (req.query.body_type) {
        // eslint-disable-next-line consistent-return
        var _query3 = 'SELECT * FROM carads WHERE LOWER(body_type) = LOWER($1)';
        var _value3 = [req.query.body_type];
        pg.query(_query3, _value3, function (err, dbres) {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: {
                message: 'error encountered'
              }
            });
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              data: {
                status: 200,
                message: 'No car found!!!'
              }
            });
            pg.end();
          } else {
            var car_ad = dbres.rows;
            res.status(200).json({
              data: {
                status: 200,
                state: 'success',
                message: 'result completed',
                car_ad: car_ad
              }
            });
            pg.end();
          }
        });
      } else if (req.query.manufacturer) {
        // eslint-disable-next-line consistent-return
        var _query4 = 'SELECT * FROM carads WHERE LOWER(manufacturer) = LOWER($1) AND LOWER(status)=LOWER($2)';
        var _value4 = [req.query.manufacturer, req.query.status];
        pg.query(_query4, _value4, function (err, dbres) {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: {
                message: 'error encountered'
              }
            });
            pg.end();
          } else if (dbres.rows.length === 0) {
            res.status(200).json({
              data: {
                message: 'No car found!!!'
              }
            });
            pg.end();
          } else {
            var car_ad = dbres.rows;
            res.status(200).json({
              data: {
                state: 'success',
                message: 'result completed',
                car_ad: car_ad
              }
            });
            pg.end();
          }
        });
      } else {
        var email = authData.user.email;
        var _query5 = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
        var _value5 = [email]; // eslint-disable-next-line consistent-return

        pg.query(_query5, _value5, function (err, dbres) {
          if (err) {
            res.status(500).json({
              error: {
                message: 'error..'
              }
            });
            console.error(err);
          } else if (dbres.rows[0].is_admin === false) {
            res.status(403).json({
              error: {
                message: 'Access Denied!!!'
              }
            });
            pg.end();
          } else {
            _query5 = 'SELECT * FROM LOWER(carads)';
            pg.query(_query5, function (err, resdb) {
              if (err) {
                res.status(500).json({
                  error: {
                    message: 'error..'
                  }
                });
                console.error(err);
              } else if (resdb.rows.length === 0) {
                res.status(200).json({
                  data: {
                    message: 'No ads found!'
                  }
                });
                pg.end();
              } else {
                var car_ad = resdb.rows;
                res.status(200).json({
                  data: {
                    state: 'success',
                    message: 'result completed',
                    car_ad: car_ad
                  }
                });
                pg.end();
              }
            });
          }
        });
      }
    }
  });
}; // GET SPECIFIC CAR


var getCar = function getCar(req, res) {
  var ad = req.params;
  jwt.verify(req.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid Token'
        }
      });
    } else {
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect(); // eslint-disable-next-line consistent-return

      var query = 'SELECT * FROM carads WHERE id = $1';
      var value = [ad.id];
      pg.query(query, value, function (err, dbres) {
        console.log(dbres);

        if (err) {
          // console.log(err);
          res.status(500).json({
            error: {
              message: 'error encountered'
            }
          });
          pg.end();
        } else if (dbres.rows === 0) {
          res.status(200).json({
            data: {
              status: 200,
              message: 'No car found!!'
            }
          });
          pg.end();
        } else {
          var car_ad = dbres.rows;
          res.status(200).json({
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
}; // GET ADS BY A OWNER


var getadsByOwner = function getadsByOwner(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
        error: {
          message: 'error..invalid Token'
        }
      });
    } else {
      var email = authData.user.email;
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
      var value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          res.status(403).json({
            error: {
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else {
          var owner = dbres.rows[0].id;
          query = 'SELECT * FROM carads WHERE owner = $1';
          value = [owner];
          pg.query(query, value, function (err, dbres) {
            if (err) {
              // console.log(err);
              res.status(500).json({
                data: {
                  message: 'error encountered'
                }
              });
              pg.end();
            } else if (dbres.rows.length === 0) {
              res.status(200).json({
                data: {
                  message: 'No car found!!'
                }
              });
              pg.end();
            } else {
              var car_ad = dbres.rows;
              res.status(200).json({
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
    }
  });
}; // POST CAR


var postCar = function postCar(req, res) {
  var newAd = req.body;
  var created_on = Date.now();
  var price = newAd.price;
  var door = newAd.door;
  door = door || null;
  var owner;
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
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
          res.status(403).json({
            error: {
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else if (dbres.rows[0].first_name === null) {
          res.status(403).json({
            error: {
              message: 'Please complete your registration inorder to post a car!!'
            }
          });
          pg.end();
        } else {
          owner = dbres.rows[0].id;
          console.log(owner);
          query = 'INSERT INTO carads(status, price, manufacturer, model, body_type, owner, state, ext_col, int_col, transmission, mileage, door, description, image_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
          value = [newAd.status, price, newAd.manufacturer, newAd.model, newAd.body_type, owner, newAd.state, newAd.ext_col, newAd.int_col, newAd.transmission, newAd.mileage, door, newAd.description, newAd.image_url]; // eslint-disable-next-line consistent-return
          // PG Query
          // eslint-disable-next-line no-unused-vars

          pg.query(query, value, function (err, dbRes) {
            if (err) {
              console.error(err);
              res.status(500).json({
                status: 500,
                error: {
                  message: 'error..'
                }
              });
              pg.end();
            } else {
              console.log(dbRes);
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
    }
  });
}; // PATCH CAR AD


var patchCar = function patchCar(req, res) {
  // eslint-disable-next-line no-unused-vars
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(403).json({
        error: {
          message: 'error..invalid token'
        }
      });
    } else {
      var email = authData.user.email;
      var adId = req.params.id;
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
          res.status(403).json({
            error: {
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else {
          currUser = dbres.rows[0].id;
          query = 'SELECT owner FROM carads WHERE id = $1';
          value = [adId]; // eslint-disable-next-line consistent-return
          // eslint-disable-next-line no-shadow

          pg.query(query, value, function (err, dbres) {
            if (err) {
              res.status(403).json({
                error: {
                  message: 'error..'
                }
              });
              console.error(err);
              pg.end();
            } else if (dbres.rows.length === 0) {
              res.status(200).json({
                data: {
                  message: 'No ad found'
                }
              });
              pg.end();
            } else {
              owner = dbres.rows[0].owner;

              if (currUser === owner) {
                query = 'UPDATE carads SET status=$1, price=$2, manufacturer=$3, model=$4, body_type=$5, owner=$6, state=$7, image_url=$8 WHERE id=$9';
                value = [ad.status, ad.price, ad.manufacturer, ad.model, ad.body_type, owner, ad.state, ad.image_url, adId]; // eslint-disable-next-line consistent-return
                // eslint-disable-next-line no-unused-vars

                pg.query(query, value, function (err, dbresponse) {
                  if (err) {
                    console.error(err);
                    res.status(500).json({
                      error: {
                        message: 'An error occured, Please check input!!!'
                      }
                    });
                    pg.end();
                  } else {
                    res.status(200).json({
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
    }
  });
}; // DELETE CAR


var deleteCar = function deleteCar(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var email = authData.user.email;

    if (err) {
      res.status(403).json({
        error: {
          message: 'error..invalid token'
        }
      });
    } else {
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      var value = [email]; // eslint-disable-next-line consistent-return

      pg.query(query, value, function (err, dbres) {
        if (err) {
          res.status(500).json({
            error: {
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else if (dbres.rows[0].is_admin === false) {
          res.status(403).json({
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
              res.status(500).json({
                error: {
                  message: 'error..'
                }
              });
              console.error(err);
              pg.end();
            } else if (resdb.rowCount === 0) {
              res.status(200).json({
                data: {
                  message: 'Ad not found!!'
                }
              });
              pg.end();
            } else {
              res.status(200).json({
                data: {
                  message: 'AD successfully deleted'
                }
              });
              pg.end();
            }
          });
        }
      });
    }
  });
}; // GET MY CAR ORDERS


var getCarOrders = function getCarOrders(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      var email = authData.user.email;
      var curruser;
      var query = 'SELECT id FROM user WHERE email = $1';
      var value = [email];
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      pg.query(query, value, function (err, resdb) {
        if (err) {
          res.status(401).json({
            error: {
              status: 401,
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else {
          curruser = resdb.rows[0].id;
          query = 'SELECT * FROM purchaseorder WHERE car_owner = $1';
          value = [curruser];
          pg.query(query, value, function (err, respo) {
            if (err) {
              res.status(500).json({
                error: {
                  status: 500,
                  message: 'error..'
                }
              });
              console.error(err);
              pg.end();
            } else {
              var my_car_orders = respo.rows;
              res.status(403).json({
                data: {
                  state: 'success',
                  status: 200,
                  message: 'orders retrieved',
                  my_car_orders: my_car_orders
                }
              });
            }
          });
        }
      });
    }
  });
}; // UPDATE MY CAR ORDERS


var updateCarOrders = function updateCarOrders(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      var email = authData.user.email;
      var query = 'SELECT id FROM users WHERE email = $1';
      var value = [email];
      var pg = new Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      pg.query(query, value, function (err, resdb) {
        if (err) {
          res.status(500).json({
            error: {
              status: 500,
              message: 'error..'
            }
          });
          console.error(err);
          pg.end();
        } else {
          var status = req.body.status;
          var orderid = req.params.id;
          var curruser = resdb.rows[0].id;
          query = 'UPDATE purchaseorder SET status=LOWER($1) WHERE id = $2';
          value = [status, orderid, curruser];
          pg.query(query, value, function (err, dbres) {
            // const result = dbres.rows[0];/
            if (err) {
              res.status(500).json({
                error: {
                  status: 401,
                  message: 'error..'
                }
              });
              console.error(err);
              pg.end();
            } else {
              res.status(200).json({
                data: {
                  status: 200,
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

module.exports = {
  getCars: getCars,
  getCar: getCar,
  postCar: postCar,
  patchCar: patchCar,
  deleteCar: deleteCar,
  getadsByOwner: getadsByOwner,
  getCarOrders: getCarOrders,
  updateCarOrders: updateCarOrders
};