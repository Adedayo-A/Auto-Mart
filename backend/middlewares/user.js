"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateInfo = exports.tokenverify = exports.tokenAuth = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tokenAuth = function tokenAuth(req, res, next) {
  var bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    var bearerHeaderSplit = bearerHeader.split(' ');
    var token = bearerHeaderSplit[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({
      status: 403,
      error: {
        message: 'A token is required for access'
      }
    });
  }
};

exports.tokenAuth = tokenAuth;

var tokenverify = function tokenverify(req, res, next) {
  _jsonwebtoken["default"].verify(req.token, process.env.JWT_KEY, function (err, authData) {
    if (err) {
      res.status(401).json({
        error: {
          status: 401,
          message: 'error..invalid token'
        }
      });
    } else {
      req.data = authData;
      next();
    }
  });
};

exports.tokenverify = tokenverify;

var validateInfo = function validateInfo(req, res, next) {
  var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  if (expression.test(String(req.body.email).toLowerCase())) {
    next();
    return;
  }

  res.status(403).json({
    status: 403,
    error: {
      message: 'Invalid email format!! Please check with this format (something@something.com) and retry!!'
    }
  });
};

exports.validateInfo = validateInfo;