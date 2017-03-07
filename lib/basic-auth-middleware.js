'use strict';

const createError = require('http-errors');
const debug = require('debug')('cbc:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('debug: inside auth middleware');

  var authHeader = req.headers.authorization;
  if(!authHeader) {
    return next(createError(401, 'error: authorization header is required'));
  }

  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) {
    return next(createError(401, 'error: username and password are required'));
  }

  var utf8str = new Buffer(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  req.auth = {
    username: authArr[0],
    password: authArr[1]
  };

  if(!req.auth.username) {
    return next(createError(401, 'error: a username is required'));
  }

  if(!req.auth.password) {
    return next(createError(401, 'error: a password is required'));
  }

  next();
};
