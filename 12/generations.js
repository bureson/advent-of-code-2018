const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const generations = 2000;
      const lines = data.split('\r\n').filter(x => x);
      let pots = lines[0].slice(14).trim();
      const rules = lines.slice(1).reduce((obj, line) => {
        const token = line.split('=>').map(x => x.trim());
        return {...obj, [token[0]]: token[1]};
      }, {});
      let oldPots;
      let generation = 0;
      let minPot = 0;
      while (generation < generations) {
        ++generation;
        if (pots.slice(0, 4).includes('#')) {
          const leftHashIndex = pots.slice(0, 4).indexOf('#');
          const leftCorrection = 4 - leftHashIndex;
          const leftPots = leftHashIndex >= 0 ? Array(leftCorrection).fill('.').join('') : '';
          minPot -= leftCorrection;
          pots = leftPots + pots;
        }
        if (pots.slice(-4).includes('#')) {
          const rightHashIndex = pots.slice(-5).lastIndexOf('#');
          const rightPots = rightHashIndex >= 0 ? Array(rightHashIndex).fill('.').join('') : '';
          pots = pots + rightPots;
        }
        let newPots = pots[0] + pots[1];
        for (let i = 2; i < pots.length - 2; i++) {
          const potArray = pots[i-2] + pots[i-1] + pots[i] + pots[i+1] + pots[i+2];
          const replacement = rules[potArray] || '.';
          newPots = newPots + replacement;
        }
        oldPots = pots;
        pots = newPots + pots[pots.length - 2] + pots[pots.length - 1];
      }
      const oldPotSum = oldPots.split('').reduce((sum, pot, i) => {
        return pot === '#' ? sum + i + minPot : sum;
      }, 0);
      const potSum = pots.split('').reduce((sum, pot, i) => {
        return pot === '#' ? sum + i + minPot : sum;
      }, 0);
      // Note: after 2000 iterations it is possible to tell addition after every generation
      console.log(((50000000000 - 2000) * (potSum - oldPotSum)) + potSum);
    });
  });
})();
