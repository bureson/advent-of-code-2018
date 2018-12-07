const fs = require('fs');

const generateRequirements = (charA, charZ) => {
  const aPos = charA.charCodeAt(0);
  const zPos = charZ.charCodeAt(0);
  return [...Array(zPos - aPos + 1)].reduce((obj, x, i) => {
    const letter = String.fromCharCode(aPos + i);
    return {...obj, [letter]: i + 61};
  }, {});
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const workers = 5;
      const list = data.split('\r\n').filter(x => !!x);
      const requirements = generateRequirements('A', 'Z');
      let pairs = list.map(i => [i.slice(5, 6), i.slice(36, 37)]);
      let time = -1;
      let pipeline = {};
      while (pairs.length > 0 || Object.keys(pipeline).length > 0) {
        time++;
        // Note: remove completed items from pipeline
        Object.keys(pipeline).forEach(key => {
          if ((time - pipeline[key]) === requirements[key]) {
            delete pipeline[key];
            const newPairs = pairs.filter(pair => pair[0] !== key);
            if (newPairs.length === 0) {
              pairs.forEach(pair => {
                const otherKey = pair[1];
                pipeline[otherKey] = time;
              });
            }
            pairs = newPairs;
          }
        });
        // Note: add new stuff to the pipeline
        if (Object.keys(pipeline).length < workers && pairs.length > 0) {
          const dependencyMap = Object.keys(requirements).filter(l => !completed.includes(l)).reduce((obj, letter) => {
            const dependencyCount = pairs.filter(pair => pair[1] === letter).length;
            return {...obj, [letter]: dependencyCount};
          }, {});
          const startLetters = Object.keys(dependencyMap).filter(key => dependencyMap[key] === 0).sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
          const availablePositions = workers - Object.keys(pipeline).length;
          const availableStartLetters = startLetters.filter(letter => !(letter in pipeline)).slice(0, availablePositions);
          availableStartLetters.forEach(letter => {
            if (!(letter in pipeline)) pipeline[letter] = time;
          });
        }
      }
      console.log(time);
    });
  });
})();
