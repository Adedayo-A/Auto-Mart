"use strict";

// require('dotenv').config();
var express = require('express');

var cors = require('cors');

var bodyParser = require('body-parser'); // eslint-disable-next-line import/no-extraneous-dependencies


var morgan = require('morgan'); // eslint-disable-next-line import/no-extraneous-dependencies


var cloudinary = require('cloudinary').v2; // import express from 'express';
// import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies


var route = require('./routes/index.js');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('combined'));
app.use(route);
var apiDoc = 'https://automart12.docs.apiary.io/#'; // Setup a default catch-all route that sends back a welcome message in JSON format.

app.get('*', function (req, res) {
  return res.status(200).send({
    message: "Welcome to Api zone, visit ".concat(apiDoc, " for API documentation")
  });
});
module.exports = app;