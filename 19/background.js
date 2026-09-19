const fs = require('fs');
const {parse, compile} = require('./device');

// Note: running the program with register 0 set to 1 would take years. The program first jumps
// to its end, where it prepares a big number, then jumps back to instruction 1 and there it sums
// all the divisors of that number with two nested loops. So let the device prepare the number,
// stop it when it gets to instruction 1 and sum the divisors in a faster way.
const getNumber = (run, registers) => {
  let number;
  run(registers, 1, (r) => {
    number = Math.max(...r);
    return true;
  });
  return number;
};

const sumDivisors = (number) => {
  let sum = 0;
  for (let i = 1; i * i <= number; i++) {
    if (number % i) continue;
    sum += i;
    if (i !== number / i) sum += number / i;
  }
  return sum;
};

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const run = compile(parse(data));
    // Note: prove the shortcut on the 1st task, where the real result is known
    const expected = run()[0];
    const shortcut = sumDivisors(getNumber(run, [0, 0, 0, 0, 0, 0]));
    if (expected !== shortcut) {
      console.log(`Shortcut does not work for this input, 1st task is ${expected}, but shortcut gives ${shortcut}`);
      return;
    }
    console.log(sumDivisors(getNumber(run, [1, 0, 0, 0, 0, 0])));
  });
})();
