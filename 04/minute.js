const fs = require('fs');

const getTimestamp = (line) => {
  return Date.parse(line.slice(1, 17));
};

const getMinute = (line) => {
  return line.slice(15, 17);
};

const assign = (map, x, y) => {
  if (!map[x]) map[x] = {};
  if (!map[x][y]) map[x][y] = 0;
  map[x][y] = map[x][y] + 1;
}

const findMaxInObj = (obj) => {
  let id = Object.keys(obj)[0];
  while (true) {
    const value = obj[id];
    const biggerKey = Object.keys(obj).find(x => obj[x] > value);
    if (biggerKey) {
      id = biggerKey;
    } else {
      break;
    }
  }
  return id;
};

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let id = null;
      let countMap = {};
      let startMinute = null;
      const list = data.split('\r\n').filter(x => !!x);
      const sortedList = list.sort((a, b) => getTimestamp(a) - getTimestamp(b));
      for (let i = 0; i < sortedList.length; i++) {
        const line = sortedList[i];
        if (line.includes('#')) {
          id = line.split(' ')[3].replace('#', '').trim();
          startMinute = null;
        }
        if (line.includes('falls')) {
          startMinute = getMinute(line);
        }
        if (line.includes('wakes')) {
          for (let j = startMinute; j < getMinute(line); j++) {
            assign(countMap, id, j);
          }
        }
      }
      const totalMap = Object.keys(countMap).reduce((map, id) => ({
        ...map,
        [id]: Object.values(countMap[id]).reduce((c, x) => c + Number(x), 0)
      }), {});
      const maxId = findMaxInObj(totalMap);
      const maxMinute = findMaxInObj(countMap[maxId]);
      console.log(maxId * maxMinute);
    });
  });
})();
