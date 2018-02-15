const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const path = require('path');

const config = require('../config');

module.exports = function(app) {
  const env = app.get('env');
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(config.root, 'client')));
  console.log(path.join(config.root, 'client'))

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
