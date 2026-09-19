const fs = require('fs');
const {getDistances} = require('./doors');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    console.log(getDistances(data).filter(distance => distance >= 1000).length);
  });
})();
