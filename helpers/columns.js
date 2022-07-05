const date = require('date-and-time');

module.exports = (history) => {
  const places = {};

  history.forEach(item => {
    const visit = {
      from: date.format(item.from, 'DD.MM.YYYY', true),
      to: date.format(item.to, 'DD.MM.YYYY', true),
    };

    delete item.from;
    delete item.to;

    if (places[item.coords]) {
      places[item.coords].delay += item.delay;
    }

    if (!places[item.coords]) {
      places[item.coords] = item;
      places[item.coords].visits = [];
    }

    places[item.coords].visits.push(visit);
  });

  const data = [];

  history = Object.values(places);

  // Find history half
  const half = Math.ceil(history.length / 2);

  data.push(history.slice(0, half));
  data.push(history.slice(half, history.length));

  return data;
};
