/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const orders = [
  {
    id: 1,
    buyer: 1,
    car_id: 2,
    amount: 500000,
    status: 'pending',
  },
  {
    id: 2,
    buyer: 3,
    car_id: 4,
    amount: 800000,
    status: 'accepted',
  },
  {
    id: 3,
    buyer: 2,
    car_id: 5,
    amount: 600000,
    status: 'pending',
  },
];

module.exports = orders;

// CREATE TABLE order(
//   id serial PRIMARY KEY,
//   status VARCHAR (50) NOT NULL,
//   amount NUMERIC NOT NULL,
//   car_id INT NOT NULL,
//   buyer INT NOT NULL,
// );
