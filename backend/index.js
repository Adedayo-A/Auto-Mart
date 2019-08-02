"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-tabs */
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
// import { Module } from 'module';
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use((0, _morgan["default"])('combined'));
app.use(_index["default"]);
var apiDoc = 'https://automart12.docs.apiary.io/#'; // Setup a default catch-all route that sends back a welcome message in JSON format.

app.get('*', function (req, res) {
  return res.status(200).send({
    message: "Welcome to Api zone, visit ".concat(apiDoc, " for API documentation")
  });
});
module.exports = app;