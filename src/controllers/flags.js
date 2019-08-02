/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Client } from 'pg';

const respondErr = (err, res) => {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered',
    },
  });
};

const postFlag = (req, res) => {
  const { info } = req.body;
  const car_id = req.params.id;
  const pg = new Client({
    connectionString: process.env.db_URL,
  });
  // PG Connect
  pg.connect();
  const query = 'INSERT INTO flag(car_id, reason) VALUES($1, $2)';
  const value = [car_id, info];
  // eslint-disable-next-line consistent-return
  // eslint-disable-next-line no-unused-vars
  pg.query(query, value, (err, dbRes) => {
    if (err) {
      respondErr(err, res);
      pg.end();
    } else {
      res.status(200).json({
        status: 200,
        data: {
          status: 200,
          message: 'Thank you for reporting this problem',
        },
      });
      pg.end();
    }
  });
};

export default postFlag;
