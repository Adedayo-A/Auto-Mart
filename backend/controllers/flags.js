"use strict";

/* eslint-disable prefer-destructuring */

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var _require = require('pg'),
    Client = _require.Client;

var jwt = require('jsonwebtoken');

var postFlag = function postFlag(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      var info = req.body.info;
      var car_id = req.params.id;
      var pg = new Client({
        connectionString: process.env.db_URL
      }); // PG Connect

      pg.connect();
      var query = 'INSERT INTO flag(car_id, reason) VALUES($1, $2)';
      var value = [car_id, info]; // eslint-disable-next-line consistent-return
      // PG Query
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, function (err, dbRes) {
        if (err) {
          console.error(err);
          res.status(403).json({
            error: {
              message: 'error encountered, please check input!!!'
            }
          });
          pg.end();
        } else {
          res.status(200).json({
            data: {
              status: 200,
              message: 'Thank you for reporting this problem'
            }
          });
          pg.end();
        }
      });
    }
  });
};

module.exports = {
  postFlag: postFlag
};