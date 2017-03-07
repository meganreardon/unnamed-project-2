'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('ccb:server');

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(morgan('dev'));

app.listen(PORT, () => {
  debug(`server up at port: ${PORT}`);
});
