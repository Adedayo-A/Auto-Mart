/* eslint-disable linebreak-style */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable linebreak-style */

const flags = [
  {
    id: 1,
    car_id: 4,
    created_on: new Date(),
    reason: 'weird demands',
  },
  {
    id: 2,
    car_id: 3,
    created_on: new Date(),
    reason: 'pricing',
  },
  {
    id: 3,
    car_id: 6,
    created_on: new Date(),
    reason: 'pricing',
  },
];

module.exports = flags;
// CREATE TABLE flag(
//   id serial PRIMARY KEY,
//   car_id INT NOT NULL,
//   reason TEXT,
//   created_on DATE NOT NULL DEFAULT CURRENT_DATE
// );
