const fs = require('fs');
const {fight, immuneSystem} = require('./battle');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    // Note: no binary search, a bigger boost can still end up in a draw where nobody can kill anybody
    let boost = 0;
    let result;
    do {
      result = fight(data, ++boost);
    } while (result.winner !== immuneSystem);
    console.log(boost, result.units);
  });
})();
