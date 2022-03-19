require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const slasher = require('express-trailing-slash');
const formidable = require('express-formidable');

const models = require('./models');
const helpers = require('./helpers');

const cities = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/cities.json')),
);


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
 * Add some useful middlewares
 */
app.use(express.static('public'));
app.use(formidable());
app.use(slasher());

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

  let recent = [];

  [data.now, ...recent] = fields;

  // Split history into 2 columns
  data.columns = helpers.columns(recent);

  res.render('live', data);
});

app.post('/suggest/', async (req, res) => {
  let results = [];

  if (!req.fields.place) {
    return res.status(200).json(results);
  }

  const place = req.fields.place.toLowerCase();

  cities.forEach((city) => {
    if (!city.name.toLowerCase().startsWith(place)) {
      return;
    }

    const result = {
      name: city.name,
      country: city.country,
      coords: `${city.lat},${city.lng}`,
      link: `https://www.google.com/maps/@${city.lat},${city.lng},12z`,
    };

    results.push(result);
  });

  // Leave some of the results
  results = results.slice(0, 10);

  res.status(200).json(results);
});

app.post('/relocate/', async (req, res) => {
  console.log(req.fields);
  let result = null;

  cities.forEach((city) => {
    if (city.coords === req.fields.coords) {
      return result = city;
    }
  });

  res.status(200).json({});
});

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  console.error(err);

  res.status(500).render('error');
});

app.use((req, res) => {
  res.status(404).render('error');
});

/**
 * Let's start the server
 */
app.listen(process.env.PORT || 3000);
