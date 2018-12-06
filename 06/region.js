const fs = require('fs');

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
      let regionSize = 0;
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          const totalDistance = list.reduce((count, item) => {
            const [x, y] = item.split(',').map(c => c.trim());
            const sum = Math.abs(i - x) + Math.abs(j - y);
            return count + sum;
          }, 0);
          if (totalDistance < 10000) regionSize++;
        }
      }
      console.log(regionSize);
    });
  });
})();
