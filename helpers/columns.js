module.exports = (history) => {
  const data = [];

  // Find history half
  const half = Math.ceil(history.length / 2);

  data.push(history.slice(0, half));
  data.push(history.slice(-half));

  return data;
};
