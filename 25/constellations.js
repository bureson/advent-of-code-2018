const fs = require('fs');

const getDistance = (a, b) => a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0);

const count = (data) => {
  const points = data.split(/\r?\n/).filter(x => x.trim()).map(line => line.match(/-?\d+/g).map(Number));
  // Note: union-find, every point starts as its own constellation
  const parents = points.map((point, i) => i);
  const find = (i) => {
    while (parents[i] !== i) {
      parents[i] = parents[parents[i]];
      i = parents[i];
    }
    return i;
  };
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (getDistance(points[i], points[j]) <= 3) parents[find(i)] = find(j);
    }
  }
  return points.filter((point, i) => find(i) === i).length;
};

module.exports = {count};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    console.log(count(data));
  });
}
