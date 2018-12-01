const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split("\n");
      const sum = list.reduce((l, i) => l + Number(i), 0);
      console.log(sum);
    });
  });
})();
