"use strict";

/* eslint-disable prefer-destructuring */

/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
var _require = require('pg'),
    Client = _require.Client;

var jwt = require('jsonwebtoken');

var postFlag = function postFlag(req, res) {
  var newFlag = req.body;
  jwt.verify(req.token, process.env.JWT_KEY, function (err) {
    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      var pg = new Client({
        connectionString: process.env.db_URL
      }); // PG Connect

      pg.connect();
      var query = 'INSERT INTO flag(car_id, reason) VALUES($1, $2)';
      var value = [newFlag.car_id, newFlag.reason]; // eslint-disable-next-line consistent-return
      // PG Query
      // eslint-disable-next-line no-unused-vars

      pg.query(query, value, function (err, dbRes) {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'error encountered, please check input!!!'
          });
          pg.end();
        } else {
          res.status(200).json({
            newFlag: newFlag,
            message: 'Thank you for reporting this problem'
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