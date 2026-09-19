const fs = require('fs');
const {simulate} = require('./water');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    // Note: only the still water stays after the spring runs dry
    console.log(simulate(data).still);
  });
})();
