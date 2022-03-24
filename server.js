require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const slasher = require('express-trailing-slash');
const formidable = require('express-formidable');

const models = require('./models');
const helpers = require('./helpers');

const cities = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/cities.json'), 'utf-8'),
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

app.get('/', async (req, res, next) => {
  try {
    const field = await models.live.findOne({
      order: [
        ['from', 'DESC'],
      ],
    });

    const data = {};
    data.now = helpers.compose(field);

    res.render('front', data);
  } catch (err) {
    return next(err);
  }
});

app.get('/live/', async (req, res, next) => {
  try {
    let fields;

    fields = await models.live.findAll({
      order: [
        ['from', 'DESC'],
      ],
    });

    const data = {};

    fields = fields.map((field) => {
      return helpers.compose(field);
    });

    let recent;

    [data.now, ...recent] = fields;
    data.columns = helpers.columns(recent);

    res.render('live', data);
  } catch (err) {
    return next(err);
  }
});

app.post('/suggest/', helpers.authorize(), async (req, res) => {
  try {
    let results = [];

    if (!req.fields.place) {
      return res.status(400).json({message: 'Place field is empty'});
    }

    const place = req.fields.place.toLowerCase();

    cities.forEach((city) => {
      if (!city.name.toLowerCase().startsWith(place)) {
        return;
      }

      /** @namespace city.lat **/
      /** @namespace city.lng **/

      const result = {
        name: city.name,
        country: city.country,
        coords: `${city.lat},${city.lng}`,
        link: `https://www.google.com/maps/@${city.lat},${city.lng},12z`,
      };

      results.push(result);
    });

    // Leave some results
    results = results.slice(0, 10);

    res.status(200).json({fields: results});
  } catch (err) {
    res.status(500).json();
  }
});

app.post('/relocate/', helpers.authorize(), async (req, res) => {
  try {
    if (!req.fields.coords) {
      return res.status(400).json({message: 'Coords field is empty'});
    }

    if (!req.fields.from) {
      return res.status(400).json({message: 'From field is empty'});
    }

    const result = cities.find((city) => {
      return req.fields.coords === `${city.lat},${city.lng}`;
    });

    const field = await models.live.findOne({
      order: [
        ['from', 'DESC'],
      ],
    });

    await models.live.update({
      to: req.fields.from
    }, {
      where: {
        id: field.id,
      }
    });

    await models.live.create({
      place: result.name,
      country: result.country,
      coords: req.fields.coords,
      from: req.fields.from,
    });

    res.status(200).json();
  } catch (err) {
    res.status(500).json();
  }
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
