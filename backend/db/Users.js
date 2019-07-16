"use strict";

/* eslint-disable linebreak-style */
var users = [{
  id: 1,
  email: 'dayo@gmail.com',
  first_name: 'Dayo',
  last_name: 'Ade',
  password: 12346,
  address: '10, Ikeja, Lagos',
  is_admin: true
}, {
  id: 2,
  email: 'daya@gmail.com',
  first_name: 'Daya',
  last_name: 'Apy',
  password: 12345,
  address: '10, Maryland, Lagos',
  is_admin: false
}];
module.exports = users; // CREATE TABLE users(
//   id serial PRIMARY KEY,
//   email VARCHAR (355) UNIQUE NOT NULL,
//   first_name VARCHAR (50) NOT NULL,
//   last_name VARCHAR (50) NOT NULL,
//   password VARCHAR (500) NOT NULL,
//   address VARCHAR(500) NOT NULL,
//   is_admin BOOLEAN NOT NULL
// );
// CREATE TABLE carAds(
//   id serial PRIMARY KEY,
//   email VARCHAR (355) UNIQUE NOT NULL,
//   first_name VARCHAR (50) UNIQUE NOT NULL,
//   first_name VARCHAR (50) UNIQUE NOT NULL,
//   password VARCHAR (50) NOT NULL,
//   address VARCHAR (500) NOT NULL,
//   is_admin BOOLEAN NOT NULL
// )
// ALTER TABLE users
//   ALTER COLUMN first_name DROP NOT NULL,
//   ALTER COLUMN last_name DROP NOT NULL,
//   ALTER COLUMN address DROP NOT NULL;
// alter table users alter column email drop not null;