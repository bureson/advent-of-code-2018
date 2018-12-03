const fs = require('fs');

const assign = (map, x, y) => {
  if (!map[x]) map[x] = {};
  if (!map[x][y]) map[x][y] = 0;
  map[x][y] = map[x][y] + 1;
}

const getCoords = (line) => {
  const [iniX, iniY] = line.split('@')[1].trim().split(':')[0].trim().split(',');
  const [lenX, lenY] = line.split('@')[1].trim().split(':')[1].trim().split('x');
  const maxX = Number(iniX) + Number(lenX);
  const maxY = Number(iniY) + Number(lenY);
  return {iniX, iniY, maxX, maxY};
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let map = {};
      const list = data.split('\r\n').filter(x => !!x);
      list.forEach(line => {
        const {iniX, iniY, maxX, maxY} = getCoords(line);
        for (let i = iniX; i < maxX; i++) {
          for (let j = iniY; j < maxY; j++) {
            assign(map, i, j);
          }
        }
      });

      list.forEach(line => {
        let isIntact = true;
        const id = line.split('@')[0].trim();
        const {iniX, iniY, maxX, maxY} = getCoords(line);
        for (let i = iniX; i < maxX; i++) {
          for (let j = iniY; j < maxY; j++) {
            if (map[i][j] > 1) isIntact = false;
          }
        }
        if (isIntact) console.log(id);
      });
    });
  });
})();
