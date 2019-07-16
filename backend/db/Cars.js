"use strict";

var cars = [{
  state: 'new',
  status: 'sold',
  price: 150000,
  manufacturer: 'toyota',
  model: 'avalon',
  body_type: 'cars',
  owner: 3,
  created_on: new Date(),
  id: 1
}, {
  state: 'new',
  status: 'available',
  price: 800000,
  manufacturer: 'lexus',
  model: 'jeep',
  body_type: 'cars',
  owner: 2,
  created_on: new Date(),
  id: 2
}, {
  state: 'new',
  status: 'available',
  price: 100000,
  manufacturer: 'mazda',
  model: 'mazda 106',
  body_type: 'cars',
  owner: 5,
  created_on: 21,
  id: 3
}, {
  state: 'used',
  status: 'available',
  price: 130000,
  manufacturer: 'Sienna',
  model: 'Sienna 102',
  body_type: 'van',
  owner: 1,
  created_on: new Date(),
  id: 4
}, {
  state: 'used',
  status: 'available',
  price: 200000,
  manufacturer: 'Mercedez',
  model: 'M-2019',
  body_type: 'cars',
  owner: 6,
  created_on: new Date(),
  id: 5
}, {
  state: 'used',
  status: 'available',
  price: 200000,
  manufacturer: 'Mitsubushi',
  model: 'M-2019',
  body_type: 'van',
  owner: 4,
  created_on: new Date(),
  id: 6
}, {
  state: 'new',
  status: 'available',
  price: 900000,
  manufacturer: 'toyota',
  model: 'camry',
  body_type: 'car',
  owner: 2,
  created_on: new Date(),
  id: 7
}];
module.exports = cars; // CREATE TABLE carads(
//   id serial PRIMARY KEY,
//   status VARCHAR (50) NOT NULL,
//   state VARCHAR (50) NOT NULL,
//   price NUMERIC NOT NULL,
//   manufacturer VARCHAR (100) NOT NULL,
//   model VARCHAR (100) NOT NULL,
//   body_type VARCHAR (60) NOT NULL,
//   owner INT NOT NULL,
//   created_on DATE NOT NULL DEFAULT CURRENT_DATE
// );
// ALTER TABLE table_name
// ADD COLUMN new_column_name data_type;
// ALTER TABLE carads
// ADD COLUMN state VARCHAR (50) NOT NULL;