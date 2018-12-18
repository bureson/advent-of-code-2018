const fs = require('fs');

const open = '.';
const trees = '|';
const lumber = '#';

const assign = (map, x, y, value) => {
  if (!map[y]) map[y] = {};
  map[y][x] = value;
}

const getInitialCount = () => [open, trees, lumber].reduce((obj, type) => ({...obj, [type]: 0}), {});

const getStats = (map, x, y) => {
  const topLeft = map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1];
  const top = map[y - 1] && map[y - 1][x] && map[y - 1][x];
  const topRight = map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1];
  const right = map[y] && map[y][x + 1] && map[y][x + 1];
  const bottomRight = map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1];
  const bottom = map[y + 1] && map[y + 1][x] && map[y + 1][x];
  const bottomLeft = map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1];
  const left = map[y] && map[y][x - 1] && map[y][x - 1];
  const stats = [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left].filter(x => x).reduce((acc, x) => {
    const typeCount = acc[x];
    return {...acc, [x]: typeCount + 1};
  }, getInitialCount());
  return stats;
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const input = data.split('\r\n').filter(x => x);
      let map = {};
      let minute = 0;
      const maxX = input[0].length;
      const maxY = input.length;
      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          assign(map, x, y, input[y][x]);
        }
      }
      let i = 0;
      // Note: for 2nd task, I've put here 2008, because after initial few hundred the values
      // began to repeat for every 28 iterations and iteration with 0 mod for 28 from 1000000000
      // is 2008
      while (minute < 10) { // Note: 2008 for 2nd task
        ++minute;
        const changes = [];
        for (let x = 0; x < maxX; x++) {
          for (let y = 0; y < maxY; y++) {
            const value = map[y][x];
            const stats = getStats(map, x, y);
            // console.log(x, y, value, stats);
            if (value === open && stats[trees] >= 3) {
              changes.push({x, y, value: trees});
            } else if (value === trees && stats[lumber] >= 3) {
              changes.push({x, y, value: lumber});
            } else if (value === lumber && (stats[lumber] < 1 || stats[trees] < 1)) {
              changes.push({x, y, value: open});
            }
          }
        }
        changes.forEach(({x, y, value}) => {
          assign(map, x, y, value);
        });
      }
      let typeCount = getInitialCount();
      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          const type = map[y][x];
          typeCount[type]++;
        }
      }
      console.log(typeCount[trees] * typeCount[lumber]);
    });
  });
})();
