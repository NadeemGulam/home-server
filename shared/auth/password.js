// Password hashing
const bcrypt = require('bcrypt');

module.exports = {
  hash: (password) => bcrypt.hash(password, 10),
  compare: (password, hash) => bcrypt.compare(password, hash)
};
