const fs = require('fs');

// Note: r = register, i = immediate value
const operations = {
  addr: (reg, a, b) => reg[a] + reg[b],
  addi: (reg, a, b) => reg[a] + b,
  mulr: (reg, a, b) => reg[a] * reg[b],
  muli: (reg, a, b) => reg[a] * b,
  banr: (reg, a, b) => reg[a] & reg[b],
  bani: (reg, a, b) => reg[a] & b,
  borr: (reg, a, b) => reg[a] | reg[b],
  bori: (reg, a, b) => reg[a] | b,
  setr: (reg, a) => reg[a],
  seti: (reg, a) => a,
  gtir: (reg, a, b) => a > reg[b] ? 1 : 0,
  gtri: (reg, a, b) => reg[a] > b ? 1 : 0,
  gtrr: (reg, a, b) => reg[a] > reg[b] ? 1 : 0,
  eqir: (reg, a, b) => a === reg[b] ? 1 : 0,
  eqri: (reg, a, b) => reg[a] === b ? 1 : 0,
  eqrr: (reg, a, b) => reg[a] === reg[b] ? 1 : 0
};

const execute = (name, registers, [, a, b, c]) => {
  const result = [...registers];
  result[c] = operations[name](registers, a, b);
  return result;
};

const toNumbers = (text) => text.match(/\d+/g).map(Number);

const parse = (data) => {
  // Note: samples and the test program are separated by three empty lines
  const [samplesPart, programPart] = data.split(/(?:\r?\n){4}/);
  const samples = [];
  const pattern = /Before:\s*\[(.*?)\]\r?\n(.*?)\r?\nAfter:\s*\[(.*?)\]/g;
  let match;
  while ((match = pattern.exec(samplesPart))) {
    samples.push({before: toNumbers(match[1]), instruction: toNumbers(match[2]), after: toNumbers(match[3])});
  }
  const program = (programPart || '').split(/\r?\n/).filter(x => x).map(toNumbers);
  return {samples, program};
};

const getMatching = ({before, instruction, after}) => {
  return Object.keys(operations).filter(name => execute(name, before, instruction).join() === after.join());
};

module.exports = {operations, execute, parse, getMatching};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {samples} = parse(data);
    console.log(samples.filter(sample => getMatching(sample).length >= 3).length);
  });
}
