const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let steps = '';
      const list = data.split('\r\n').filter(x => !!x);
      let pairs = list.map(i => [i.slice(5, 6), i.slice(36, 37)]);
      let i = 0;
      while (pairs.length > 0) {
        i++;
        const dependencyMap = pairs.reduce((list, pair) => list.includes(pair[0]) ? list : [...list, pair[0]], []).reduce((obj, letter) => {
          const dependencyCount = pairs.filter(pair => pair[1] === letter).length;
          return {...obj, [letter]: dependencyCount};
        }, {});
        const startLetters = Object.keys(dependencyMap).filter(key => dependencyMap[key] === 0).sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
        const startLetter = startLetters[0];
        steps += startLetter;
        const newPairs = pairs.filter(pair => pair[0] !== startLetter);
        if (newPairs.length === 0) {
          steps = steps + pairs.map(pair => pair[1]).sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('');
        }
        pairs = newPairs;
      }
      console.log(steps);
    });
  });
})();
