const fs = require('fs');

const generateMap = (map, x, y) => {
  if (!map[x]) map[x] = {};
  if (!map[x][y]) map[x][y] = {idMap: {}};
}

const findMinInObj = (obj) => {
  let id = Object.keys(obj)[0];
  while (true) {
    const value = obj[id];
    const biggerKey = Object.keys(obj).find(x => obj[x] < value);
    if (biggerKey) {
      id = biggerKey;
    } else {
      break;
    }
  }
  // Note: null if one point has same distance with multiple IDs
  if (Object.keys(obj).find(x => x !== id && obj[x] === obj[id])) return null;
  return id;
};

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split('\r\n').filter(x => !!x);
      const xList = list.map(x => x.split(',')[0].trim());
      const yList = list.map(x => x.split(',')[1].trim());
      const minX = Math.min(...xList);
      const minY = Math.min(...yList);
      const maxX = Math.max(...xList);
      const maxY = Math.max(...yList);
      let map = {};
      // Note: generate map
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          generateMap(map, i, j);
        }
      }
      // // Note: assign points
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (map[i][j] && !map[i][j].id) {
            const idMap = list.reduce((obj, item, p) => {
              const index = p + 1;
              const [x, y] = item.split(',').map(c => c.trim());
              const distance = Math.abs(x - i) + Math.abs(y - j);
              return {...obj, [index]: distance};
            }, {});
            map[i][j] = findMinInObj(idMap);
          }
        }
      }
      // Note: remove borders (infinity)
      const infinityIdList = [
        ...Object.keys(map).filter(key => map[key][minY]).map(key => map[key][minY]),
        ...Object.keys(map).filter(key => map[key][maxY]).map(key => map[key][maxY]),
        ...Object.values(map[minX]).filter(x => x),
        ...Object.values(map[maxX]).filter(x => x),
      ].reduce((list, x) => list.includes(x) ? list : [...list, x], []);
      // Note: count area
      let countMap = {};
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (map[i][j] && !infinityIdList.includes(map[i][j])) {
            const id = map[i][j];
            const count = countMap[id] || 0;
            countMap = {
              ...countMap,
              [id]: count + 1
            }
          }
        }
      }
      console.log(Object.values(countMap).sort((a, b) => Number(b) - Number(a))[0]);
    });
  });
})();
