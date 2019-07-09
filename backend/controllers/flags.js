/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('pg');

const jwt = require('jsonwebtoken');

const postFlag = (req, res) => {
  const newFlag = req.body;
  jwt.verify(req.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(403).json({
        message: 'error..invalid token',
      });
    } else {
      const pg = new Client({
        connectionString: process.env.db_URL,
      });
      // PG Connect
      pg.connect();
      const query = 'INSERT INTO flag(car_id, reason) VALUES($1, $2)';
      const value = [newFlag.car_id, newFlag.reason];
      // eslint-disable-next-line consistent-return
      // PG Query
      // eslint-disable-next-line no-unused-vars
      pg.query(query, value, (err, dbRes) => {
        if (err) {
          console.error(err);
          res.status(403).json({
            message: 'error encountered, please check input!!!',
          });
        } else {
          res.status(200).json({
            newFlag,
            message: 'Thank you for reporting this problem',
          });
          pg.end();
        }
      });
    }
  });
};

module.exports = {
  postFlag,
};
