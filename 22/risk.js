const fs = require('fs');

// Note: returns function which gives type of any region, 0 = rocky, 1 = wet, 2 = narrow
const createCave = (data) => {
  const [depth, targetX, targetY] = data.match(/\d+/g).map(Number);
  const levels = {};
  const getErosionLevel = (x, y) => {
    if (!levels[y]) levels[y] = {};
    if (levels[y][x] === undefined) {
      let index;
      if ((x === 0 && y === 0) || (x === targetX && y === targetY)) index = 0;
      else if (y === 0) index = x * 16807;
      else if (x === 0) index = y * 48271;
      else index = getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);
      levels[y][x] = (index + depth) % 20183;
    }
    return levels[y][x];
  };
  const getType = (x, y) => getErosionLevel(x, y) % 3;
  return {target: {x: targetX, y: targetY}, getType};
};

module.exports = {createCave};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {target, getType} = createCave(data);
    let risk = 0;
    for (let y = 0; y <= target.y; y++) {
      for (let x = 0; x <= target.x; x++) {
        risk += getType(x, y);
      }
    }
    console.log(risk);
  });
}
