"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var respondErr = function respondErr(err, res) {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered'
    }
  });
};

var postFlag = function postFlag(req, res) {
  var info = req.body.info;
  var car_id = req.params.id;
  var pg = new _pg.Client({
    connectionString: process.env.db_URL
  }); // PG Connect

  pg.connect();
  var query = 'INSERT INTO flag(car_id, reason) VALUES($1, $2)';
  var value = [car_id, info]; // eslint-disable-next-line consistent-return
  // eslint-disable-next-line no-unused-vars

  pg.query(query, value, function (err, dbRes) {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      res.status(200).json({
        status: 200,
        data: {
          status: 200,
          message: 'Thank you for reporting this problem'
        }
      });
      pg.end();
    }
  });
};

var _default = postFlag;
exports["default"] = _default;