const fs = require('fs');
const {parse, compile} = require('./device');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const run = compile(parse(data));
    console.log(run()[0]);
  });
})();
