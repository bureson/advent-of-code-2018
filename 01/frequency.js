const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split("\n");
      let sumx = null;
      let x = [0];
      while (sumx === null) {
        x = list.reduce((l, i) => {
          const lastSum = l[l.length - 1];
          const newSum = lastSum + Number(i);
          if (l.includes(newSum) && sumx === null) sumx = newSum;
          return l.concat(newSum);
        }, x);
      }
      console.log(sumx);
    });
  });
})();
