'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cbc:group-router.js');

const Group = require('../model/group.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const groupRouter = module.exports = Router();

groupRouter.post('/api/group', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST to /api/group');

  req.body.userID = req.user._id;
  new Group(req.body).save()
  .then( group => res.json(group))
  .catch(next);
});

groupRouter.get('/api/group:id', bearerAuth, function(req, res, next) {
  debug('GET to /api/group');

  Group.findById(req.params.id)
  .then( group => {
    if (group.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'error: invalid user'));
    }
    console.log('\n::: IN GROUP ROUTER \n');
    res.json(group);
  })
  .catch(next);
});
