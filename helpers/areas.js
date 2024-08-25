module.exports = (history) => {
  const areas = {};

  history.forEach(item => {
    areas[item.country] = areas[item.country] || 0;
    areas[item.country] = areas[item.country] + item.delay;
  });

  const thresholds = [7, 14, 30, 90, 180, 365];

  const colors = [
    'var(--color-area-1)',
    'var(--color-area-2)',
    'var(--color-area-3)',
    'var(--color-area-4)',
    'var(--color-area-5)',
    'var(--color-area-6)',
    'var(--color-area-7)',
  ];

  const styles = [];

  for (const code in areas) {
    let color = colors[colors.length - 1];

    for (let i = 0; i < thresholds.length; i++) {
      if (areas[code] < thresholds[i]) {
        color = colors[i];
        break;
      }
    }

    styles.push(`#${code} {fill:${color}}`);
  }

  return styles;
};
