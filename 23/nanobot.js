const fs = require('fs');

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

const getCoords = (line) => {
  const [x, y, z] = line.split('<')[1].split('>')[0].split(',').map(c => Number(c));
  const r = Number(line.split('=')[2]);
  return [x, y , z, r];
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split('\r\n').filter(x => !!x);
      const maxObj = list.reduce((obj, line, i) => {
        const [x, y , z, r] = getCoords(line);
        return {... obj, [i]: r};
      }, {});
      const id = findMaxInObj(maxObj);
      let count = 0;
      const [ix, iy, iz, ir] = getCoords(list[id]);
      for (let j = 0; j < list.length; j++) {
        const [jx, jy, jz] = getCoords(list[j]);
        const dx = Math.abs(ix - jx);
        const dy = Math.abs(iy - jy);
        const dz = Math.abs(iz - jz);
        const dt = dx + dy + dz;
        if (dt <= ir) ++count;
      }
      console.log(count);
    });
  });
})();
