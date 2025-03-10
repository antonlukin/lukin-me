const differ = require('datetime-diff');

module.exports = (field) => {
  if (field.to === null) {
    field.to = new Date();
  }

  const between = differ(field.from, field.to);

  const compose = {
    id: field.id,
    place: field.place,
    country: field.country,
    coords: field.coords,
    delay: Math.floor(between.days),
    from: field.from,
    to: field.to,
    link: `https://www.google.com/maps/@${field.coords},12z`,
  };

  const photos = field.get({ plain: true }).photos;

  if (photos) {
    compose.photos = photos.map((v) => v.url);
  }

  return compose;
};
