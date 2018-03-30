const path = require('path');

module.exports = {
  port: process.env.PORT || 9000,
  ip: '0.0.0.0',
  root: path.normalize(__dirname + '/../..'),
}
