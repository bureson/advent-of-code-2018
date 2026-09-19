const fs = require('fs');
const {simulate} = require('./combat');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    // Note: no binary search here, higher attack power does not guarantee that no elf dies
    let power = 3;
    let result;
    do {
      result = simulate(data, ++power, true);
    } while (result.elfDied);
    console.log(power, result.rounds, result.hp, result.outcome);
  });
})();
