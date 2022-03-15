const differ = require('date-differ');

module.exports = (field) => {
  if (field.to === null) {
    field.to = new Date();
  }

  const compose = {
    place: field.place,
    delay: differ({from: field.from, to: field.to}),
    link: `https://www.google.com/maps/@${field.lat},${field.lng},12z`,
  };

  if (compose.delay === 'Dates are the same day') {
    compose.delay = '1 day';
  }

  return compose;
};
