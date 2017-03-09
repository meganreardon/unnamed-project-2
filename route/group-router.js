'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cbc:group-router');

const Group = require('../model/group.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const groupRouter = module.exports = Router();

groupRouter.post('/api/group', bearerAuth, jsonParser, function(req, res, next) {
  debug('debug: POST to /api/group in group-router.js');

  req.body.userID = req.user._id;
  new Group(req.body).save()
  .then( group => res.json(group))
  .catch(next);
});

groupRouter.get('/api/group:id', bearerAuth, function(req, res, next) {
  debug('debug: GET to /api/group in group-router.js');

  Group.findById(req.params.id)
  .then( gallery => {
    if (gallery.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'error: invalid user'));
    }
    res.json(gallery);
  })
  .catch(next);
});
