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
      // Note: assign points
      for (let i = 1; i <= list.length; i++) {
        const [x, y] = list[i - 1].split(',').map(c => c.trim());
        map[x][y] = {id: i};
      }
      // Note: calculate distances
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (map[i][j] && map[i][j].id) {
            const id = map[i][j].id;
            for (let x = minX; x <= maxX; x++) {
              for (let y = minY; y <= maxY; y++) {
                if (!map[x][y].id) {
                  const existingMap = map[x][y].idMap;
                  const distance = Math.abs(i - x) + Math.abs(j - y);
                  map[x][y] = {idMap: {...existingMap, [id]: distance}};
                }
              }
            }
          }
        }
      }
      // Note: get ownership
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (map[i][j] && map[i][j].idMap) {
            const idMap = map[i][j].idMap;
            const id = findMinInObj(idMap);
            map[i][j] = id ? {id: Number(id)} : null;
          }
        }
      }
      // Note: remove borders (inifite)
      const infinityIdList = [
        ...Object.keys(map).filter(key => map[key][minY] && map[key][minY].id).map(key => map[key][minY].id),
        ...Object.keys(map).filter(key => map[key][maxY] && map[key][maxY].id).map(key => map[key][maxY].id),
        ...Object.values(map[minX]).filter(x => x && x.id).map(x => x.id),
        ...Object.values(map[maxX]).filter(x => x && x.id).map(x => x.id),
      ].reduce((list, x) => list.includes(x) ? list : [...list, x], []);
      // Note: count area
      let countMap = {};
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (map[i][j] && map[i][j].id && !infinityIdList.includes(map[i][j].id)) {
            const id = map[i][j].id;
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
