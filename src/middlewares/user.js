const tokenAuth = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearerHeaderSplit = bearerHeader.split(' ');
    const token = bearerHeaderSplit[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({
      message: 'A token is required for access',
    });
  }
};

const validateInfo = (req, res, next) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  if (expression.test(String(req.body.email).toLowerCase())) {
    next();
    return;
  }
  res.status(403).json({
    status: 403,
    error: {
      message: 'Invalid email format!! Please check with this format (something@something.com) and retry!!',
    },
  });
};


// const passwordCheck = (req, res, next) => {
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
  tokenAuth,
  validateInfo,
};
