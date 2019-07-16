"use strict";

var tokenAuth = function tokenAuth(req, res, next) {
  var bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    var bearerHeaderSplit = bearerHeader.split(' ');
    var token = bearerHeaderSplit[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({
      message: 'A token is required for access'
    });
  }
};

var validateInfo = function validateInfo(req, res, next) {
  var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  if (expression.test(String(req.body.email).toLowerCase())) {
    var pwd1 = req.body.password;
    var pwd2 = req.body.confirm_password;

    if (pwd1 !== '' && pwd1 === pwd2) {
      if (pwd1.length < 6) {
        res.status(400).json({
          message: 'Error: Password must contain at least six characters!'
        });
        return false;
      }

      expression = /[0-9]/;

      if (!expression.test(pwd1)) {
        res.status(400).json({
          message: 'Error: password must contain at least one number (0-9)!'
        });
        return false;
      }

      expression = /[a-z]/;

      if (!expression.test(pwd1)) {
        res.status(400).json({
          message: 'Error: password must contain at least one lowercase letter (a-z)!'
        });
        return false;
      }

      expression = /[A-Z]/;

      if (!expression.test(pwd1)) {
        res.status(400).json({
          message: 'Error: password must contain at least one uppercase letter (A-Z)!'
        });
        return false;
      }

      next();
    } else {
      res.status(400).json({
        message: 'Error: Please check that you\'ve entered and confirmed your password correctly!'
      });
      return false;
    }
  } else {
    res.status(403).json({
      message: 'Invalid email format!! Please check with this format (something@something.com) and retry!!'
    });
    return false;
  }
}; // const passwordCheck = (req, res, next) => {
//   if (req.body.password !== req.body.confirm_password) {
//     res.status(403).json({
//       message: 'Invalid password!! Please check password and retry!!',
//     });
//   } else {
//     next();
//   }
// };
// const emailCheck = (req, res, next) => {
//   const expression = /\S+@\S+/;
//   if (expression.test(String(req.body.email).toLowerCase())) {
//     next();
//   } else {
//     res.status(403).json({
//       message: 'two - Invalid email format!! Please check with this format (something@something.com) and retry!!',
//     });
//   }
// };


module.exports = {
  tokenAuth: tokenAuth,
  validateInfo: validateInfo
};