"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenVerify = exports.getAUser = exports.updateUser = exports.verifyUser = exports.signUp = void 0;

var _pg = require("pg");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable linebreak-style */

/* eslint-disable eol-last */

/* eslint-disable linebreak-style */
var respondErr = function respondErr(err, res) {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered'
    }
  });
};

var signUp = function signUp(req, res) {
  var user = req.body;
  var myPassword = user.password;

  _bcrypt["default"].hash(myPassword, 10, function (err, hash) {
    // Store hash in database
    if (err) {
      console.log(err);
    } else {
      var hashedPassword = hash;
      var pg = new _pg.Client({
        connectionString: process.env.db_URL
      });
      pg.connect();
      var query = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6)';
      var value = [user.email, user.first_name, user.last_name, hashedPassword, user.address, user.is_admin]; // PG Connect
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, function (err, dbRes) {
        if (err) {
          if (err.constraint === 'users_email_key') {
            console.log(err);
            res.status(500).json({
              status: 500,
              error: {
                message: 'email already exist, please choose another email'
              }
            });
            pg.end();
          } else if (err) {
            respondErr(err, res);
            pg.end();
          }
        } else {
          _jsonwebtoken["default"].sign({
            user: user
          }, process.env.JWT_KEY, {
            expiresIn: '20m'
          }, function (err, token) {
            query = 'SELECT * FROM users WHERE email = $1';
            value = [user.email];
            pg.query(query, value, function (err, dbres) {
              if (err) {
                respondErr(err, res);
                pg.end();
              } else {
                var username = dbres.rows[0].first_name;

                if (username === null) {
                  username = 'user';
                }

                res.status(200).send({
                  status: 200,
                  data: {
                    username: username,
                    state: 'success',
                    status: 200,
                    message: 'Sign up successful',
                    token: token
                  }
                });
                pg.end();
              }
            });
          });
        }
      });
    }
  });
};

exports.signUp = signUp;

var verifyUser = function verifyUser(req, res) {
  // eslint-disable-next-line max-len
  var user = req.body;
  var myPassword = user.password;
  var userEmail = user.email;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect(); // PG Connect
  // eslint-disable-next-line consistent-return

  var query = 'SELECT * FROM users WHERE email = $1';
  var value = [userEmail];
  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else if (dbres.rows.length === 0) {
      res.status(403).json({
        status: 403,
        error: {
          message: 'error encountered, Invalid Email'
        }
      });
      pg.end();
    } else {
      var dbPsw = dbres.rows[0].password;
      var username = dbres.rows[0].first_name;
      var admin = dbres.rows[0].is_admin;

      if (username === null) {
        username = 'user';
      }

      _bcrypt["default"].compare(myPassword, dbPsw, function (err, match) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else if (!match) {
          res.status(403).json({
            status: 403,
            error: {
              message: 'error encountered, Invalid password'
            }
          });
          pg.end();
        } else {
          _jsonwebtoken["default"].sign({
            user: user
          }, process.env.JWT_KEY, {
            expiresIn: '20m'
          }, function (err, token) {
            res.status(200).json({
              status: 200,
              data: {
                username: username,
                admin: admin,
                message: "Success..Welcome Back ".concat(username),
                token: token
              }
            });
          });

          pg.end();
        }
      });
    }
  });
}; // UPDATE A USER


exports.verifyUser = verifyUser;

var updateUser = function updateUser(req, res) {
  var data = req.data;
  var email = data.user.email;
  var token = req.token;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  });
  pg.connect();
  var query = 'UPDATE users SET first_name=$1, last_name=$2, address=$3 WHERE email = $4';
  var value = [req.body.first_name, req.body.last_name, req.body.address, email]; // eslint-disable-next-line consistent-return

  pg.query(query, value, function (err, dbres) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else if (dbres.rowCount === 0) {
      res.status(403).json({
        error: {
          message: 'An error occured, please check input'
        }
      });
      pg.end();
    } else {
      query = 'SELECT * FROM users WHERE email = $1';
      value = [email];
      pg.query(query, value, function (err, dbresp) {
        if (err) {
          respondErr(err, res);
          pg.end();
        } else {
          var username = dbresp.rows[0].first_name;
          var is_admin = dbresp.rows[0].is_admin;

          if (username === null) {
            username = 'user';
          }

          res.status(200).send({
            status: 200,
            data: {
              username: username,
              state: 'success',
              status: 200,
              message: 'Profile updated',
              token: token,
              is_admin: is_admin
            }
          });
          pg.end();
        }
      });
    }
  });
}; // GET A USER


exports.updateUser = updateUser;

var getAUser = function getAUser(req, res) {
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
      var userdata = dbres.rows[0];
      var _email = userdata.email,
          first_name = userdata.first_name,
          last_name = userdata.last_name,
          address = userdata.address,
          token = userdata.token;
      res.status(200).json({
        status: 200,
        data: {
          email: _email,
          first_name: first_name,
          last_name: last_name,
          address: address,
          token: token
        }
      });
      pg.end();
    }
  });
}; // TOKEN VERIFICATION


exports.getAUser = getAUser;

var tokenVerify = function tokenVerify(req, res) {
  _jsonwebtoken["default"].verify(req.body.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.json({
        status: 401,
        error: {
          message: 'Session Expired'
        }
      });
    } else {
      res.json({
        status: 200
      });
    }
  });
}; // module.exports = {
//   signUp,
//   verifyUser,
//   updateUser,
//   getAUser,
//   tokenVerify,
// };
// export default {
//   signUp,
//   verifyUser,
//   updateUser,
//   getAUser,
//   tokenVerify,
// };


exports.tokenVerify = tokenVerify;