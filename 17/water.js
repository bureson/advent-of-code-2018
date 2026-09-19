const fs = require('fs');

const clay = '#';
const flowing = '|';
const still = '~';

const simulate = (data) => {
  const map = {};
  const get = (x, y) => map[y] && map[y][x];
  const set = (x, y, value) => {
    if (!map[y]) map[y] = {};
    map[y][x] = value;
  };

  data.split(/\r?\n/).filter(x => x).forEach(line => {
    // Note: "x=495, y=2..7" or "y=7, x=495..501", the first axis is fixed, the second is a range
    const [fixed, from, to] = line.match(/\d+/g).map(Number);
    for (let i = from; i <= to; i++) {
      if (line[0] === 'x') set(fixed, i, clay);
      else set(i, fixed, clay);
    }
  });
  const rows = Object.keys(map).map(Number);
  const minY = Math.min(...rows);
  const maxY = Math.max(...rows);

  // Note: water can rest only on clay or on still water
  const isSupported = (x, y) => get(x, y + 1) === clay || get(x, y + 1) === still;

  // Note: go sideways until a wall or until there is nothing to stand on
  const scan = (x, y, direction) => {
    while (isSupported(x, y) && get(x + direction, y) !== clay) x += direction;
    return {x, spills: !isSupported(x, y)};
  };

  const fall = (x, startY, isSpring = false) => {
    let y = startY;
    while (y < maxY && !get(x, y + 1)) {
      set(x, y, flowing);
      ++y;
    }
    set(x, y, flowing);
    // Note: fell out of the scan or joined water which is already flowing away
    if (y === maxY || get(x, y + 1) === flowing) return;
    // Note: fill row by row upwards, a spilled water never above the row it spilled from,
    // that row is taken care of by the caller
    while (isSpring ? y >= startY : y > startY) {
      const left = scan(x, y, -1);
      const right = scan(x, y, 1);
      const isClosed = !left.spills && !right.spills;
      for (let i = left.x; i <= right.x; i++) set(i, y, isClosed ? still : flowing);
      if (isClosed) {
        --y;
        continue;
      }
      const spills = [left, right].filter(side => side.spills);
      spills.forEach(side => fall(side.x, y));
      // Note: the water below could fill up to this row, then the water spreads further over it
      // and the row has to be checked again
      if (!spills.some(side => isSupported(side.x, y))) return;
    }
  };

  fall(500, 0, true);

  const count = {[flowing]: 0, [still]: 0};
  for (let y = minY; y <= maxY; y++) {
    Object.values(map[y] || {}).forEach(tile => {
      if (tile !== clay) count[tile]++;
    });
  }
  return {flowing: count[flowing], still: count[still], map, minY, maxY};
};

module.exports = {simulate};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const result = simulate(data);
    console.log(result.flowing + result.still);
  });
}
