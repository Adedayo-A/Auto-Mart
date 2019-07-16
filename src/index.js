/* eslint-disable no-tabs */
// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies

// import express from 'express';
// import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import cors from 'cors';

// eslint-disable-next-line import/no-extraneous-dependencies
const route = require('./routes/index.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(route);

const apiDoc = 'https://automart12.docs.apiary.io/#';
// Setup a default catch-all route that sends back a welcome message in JSON format.

app.get('*', (req, res) => res.status(200).send({
  message: `Welcome to Api zone, visit ${apiDoc} for API documentation`,
}));

module.exports = app;
