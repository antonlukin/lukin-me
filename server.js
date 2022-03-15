require('dotenv').config();

const path = require('path');
const express = require('express');

const models = require('./models');
const helpers = require('./helpers');

/**
 * Create express instance
 */
const app = express();

/**
 * Set views engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Hide specific Express header
 */
app.disable('x-powered-by');

app.get('/', async (req, res) => {
  const fields = await models.live.findOne({
    order: [
      ['from', 'DESC'],
    ],
  });

  const data = {};
  data.now = helpers.compose(fields);

  res.render('front', data);
});

app.get('/live/', async (req, res) => {
  let fields = await models.live.findAll({
    order: [
      ['from', 'DESC'],
    ],
  });

  const data = {};

  fields = fields.map((field) => {
    return helpers.compose(field);
  });

  [data.now, ...history] = fields;

  // Split history into 2 columns
  data.columns = helpers.columns(history);

  res.render('live', data);
});

/**
 * Let's start the server
 */
app.listen(process.env.PORT || 3000);
