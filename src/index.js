/* eslint-disable no-tabs */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import morgan from 'morgan';

// eslint-disable-next-line import/no-extraneous-dependencies
import route from './routes/index';
// import { Module } from 'module';

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
