const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.split('\n');
      const counts = list.reduce((count, item) => {
        const obj = item.split('').reduce((obj, letter) => {
          const letterCount = obj[letter] || 0;
          return {...obj, [letter]: letterCount + 1};
        }, {});
        const hasTwo = Object.values(obj).some(x => x === 2);
        const hasThree = Object.values(obj).some(x => x === 3);
        const two = hasTwo ? count.two + 1 : count.two;
        const three = hasThree ? count.three + 1 : count.three;
        return {two, three};
      }, {two: 0, three: 0});
      console.log(counts.two * counts.three);
    });
  });
})();
