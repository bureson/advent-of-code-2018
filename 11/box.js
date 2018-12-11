const fs = require('fs');

const assign = (map, x, y, value) => {
  if (!map[x]) map[x] = {};
  map[x][y] = value;
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const serial = Number(data.trim());
      let map = {};
      let xWinner = 0;
      let yWinner = 0;
      let globalSum = 0;
      let boxWinner = 0;
      for (let i = 1; i <= 300; i++) {
        for (let j = 1; j <= 300; j++) {
          const rackID = i + 10;
          const powerLevel = rackID * j;
          const value = (powerLevel + serial) * rackID;
          const hundreds = value > 99 ? Math.floor(value / 100).toString().split('').reverse()[0] : 0;
          const fuelLevel = hundreds - 5;
          assign(map, i, j, fuelLevel);
        }
      }
      for (let i = 1; i <= 300; i++) {
        for (let j = 1; j <= 300; j++) {
          const maxBoxSize = 300 - Math.max(j, i);
          for (let b = 1; b <= maxBoxSize; b++) {
            let sum = 0;
            for (let x = 0; x < b; x++) {
              for (let y = 0; y < b; y++) {
                sum += map[i + x][j + y];
              }
            }
            if (sum > globalSum) {
              globalSum = sum;
              xWinner = i;
              yWinner = j;
              boxWinner = b;
            }
          }
        }
      }
      console.log(xWinner, yWinner, boxWinner);
    });
  });
})();
