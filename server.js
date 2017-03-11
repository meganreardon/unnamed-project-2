'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cbc:server.js');

const authRouter = require('./route/auth-router.js');
const groupRouter = require('./route/group-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

// mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(groupRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`debug: server is up at port: ${PORT}`);
});
