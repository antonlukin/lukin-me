module.exports = (history) => {
  const places = {};

  history.forEach(item => {
    if (places[item.coords]) {
      places[item.coords].delay += item.delay;

      return;
    }

    places[item.coords] = item;
  });

  const data = [];

  history = Object.values(places);

  // Find history half
  const half = Math.ceil(history.length / 2);

  data.push(history.slice(0, half));
  data.push(history.slice(half, history.length));

  return data;
};
