const fs = require('fs');
const {watch} = require('./halt');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    // Note: compared values start to repeat after a while, the last new one before the first
    // repeated value halts the program after the most instructions. Takes a few seconds.
    const seen = new Set();
    let last;
    watch(data, (value) => {
      if (seen.has(value)) return true;
      seen.add(value);
      last = value;
      return false;
    });
    console.log(last);
  });
})();
