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

const findMaxInObjDeep = (obj) => {
  let maxId = null;
  let maxMinute = null;
  let maxNumber = 0;
  for (let i = 0; i < Object.keys(obj).length; i++) {
    const forId = Object.keys(obj)[i];
    const forMaxMinute = findMaxInObj(obj[forId]);
    if (obj[forId][forMaxMinute] > maxNumber) {
      maxNumber = obj[forId][forMaxMinute];
      maxMinute = forMaxMinute;
      maxId = forId;
    }
  }
  return {maxId, maxMinute};
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
      const {maxId, maxMinute} = findMaxInObjDeep(countMap);
      console.log(maxId * maxMinute);
    });
  });
})();
