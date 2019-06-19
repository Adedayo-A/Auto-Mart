
const tokenAuth = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearerHeaderSplit = bearerHeader.split(' ');
    const token = bearerHeaderSplit[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

// const tokenGen = (payload, cb) => {
//   jwt.sign(
//     payload,
//     process.env.JWT_KEY,
//     {
//       expiresIn: '1h',
//     },
//     cb,
//   );
// };

module.exports = tokenAuth;
