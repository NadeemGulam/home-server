// JWT utilities
const jwt = require('jsonwebtoken');

module.exports = {
  sign: (payload, secret) => jwt.sign(payload, secret),
  verify: (token, secret) => jwt.verify(token, secret)
};
