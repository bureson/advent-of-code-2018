const fs = require('fs');

const justOneDifference = (a, b) => {
  const diff = a.filter((x, i) => b[i] !== x);
  return diff.length === 1;
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split('\r\n');
      let found = false;
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          const a = list[j].split('');
          const b = list[i].split('');
          if (!found && justOneDifference(a, b)) {
            found = true;
            const common = a.filter((x, i) => b[i] === x).join('');
            console.log(common);
          }
        }
      }
    });
  });
})();
