// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const pg = require('pg');
const route = require('./routes/index.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(route);
const apiDoc = 'https://automart12.docs.apiary.io/#';
// Setup a default catch-all route that sends back a welcome message in JSON format.

// eslint-disable-next-line no-unused-vars
const connect = 'postgres://firulvau:pTPhhHcTt0aZTW0zZQ471t9k263B68W1@rogue.db.elephantsql.com:5432/firulvau';

app.get('*', (req, res) => res.status(200).send({
  message: `Welcome to Api zone, visit ${apiDoc} for API documentation`, 
}));

module.exports = app;
