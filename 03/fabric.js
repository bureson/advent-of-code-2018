const fs = require('fs');

const assign = (map, x, y) => {
  if (!map[x]) map[x] = {};
  if (!map[x][y]) map[x][y] = 0;
  map[x][y] = map[x][y] + 1;
}

const getOverlap = map => {
  const keys = Object.keys(map);
  const overlap = keys.reduce((o, i) => {
    const columnOverlap = Object.values(map[i]).reduce((c, j) => {
      const hasTwoOrMore = j > 1;
      return hasTwoOrMore ? c + 1 : c;
    }, 0);
    return o + columnOverlap;
  }, 0);
  return overlap;
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let map = {};
      const list = data.split('\r\n').filter(x => !!x);
      list.forEach(line => {
        const coords = line.split('@')[1].trim().split(':')[0].trim().split(',');
        const dimensions = line.split('@')[1].trim().split(':')[1].trim().split('x');
        const maxX = Number(coords[0]) + Number(dimensions[0]);
        const maxY = Number(coords[1]) + Number(dimensions[1]);
        for (let i = coords[0]; i < maxX; i++) {
          for (let j = coords[1]; j < maxY; j++) {
            assign(map, i, j);
          }
        }
      });
      const overlap = getOverlap(map);
      console.log(overlap);
    });
  });
})();
