const fs = require('fs');
const {operations, execute, parse, getMatching} = require('./samples');

(function () {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {samples, program} = parse(data);
    // Note: every opcode number starts with all names possible, samples narrow them down
    const candidates = {};
    samples.forEach(sample => {
      const opcode = sample.instruction[0];
      const matching = getMatching(sample);
      candidates[opcode] = (candidates[opcode] || Object.keys(operations)).filter(name => matching.includes(name));
    });
    // Note: opcode with a single candidate is resolved, remove its name from the others and repeat
    const opcodes = {};
    while (Object.keys(candidates).length) {
      const resolved = Object.keys(candidates).find(opcode => candidates[opcode].length === 1);
      if (resolved === undefined) throw new Error('Opcodes cannot be resolved');
      const name = candidates[resolved][0];
      opcodes[resolved] = name;
      delete candidates[resolved];
      Object.keys(candidates).forEach(opcode => {
        candidates[opcode] = candidates[opcode].filter(candidate => candidate !== name);
      });
    }
    const registers = program.reduce((reg, instruction) => execute(opcodes[instruction[0]], reg, instruction), [0, 0, 0, 0]);
    console.log(registers[0]);
  });
})();
