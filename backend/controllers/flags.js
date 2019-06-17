const flags = require('../db/Flags');

const postFlag = (req, res) => {
  const newFlag = req.body;
  newFlag.id = flags.length + 1;
  newFlag.created_on = new Date();
  flags.push(newFlag);
  res.json({
    newFlag,
    message: 'Thank you for reporting this problem',
  });
}

module.exports = {
  postFlag,
}; 