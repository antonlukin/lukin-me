const differ = require('datetime-diff');

module.exports = (field) => {
  if (field.to === null) {
    field.to = new Date();
  }

  const between = differ(field.from, field.to);

  const compose = {
    place: field.place,
    coords: field.coords,
    delay: Math.ceil(between.days),
    from: field.from,
    to: field.to,
    link: `https://www.google.com/maps/@${field.coords},12z`,
  };

  return compose;
};
