const fs = require('fs');
const {parse, compile} = require('../19/device');

// Note: register 0 is used by a single instruction, eqrr which compares it with another register
// and halts the program when they are equal. So it is enough to watch the values it is compared to.
const immediateA = ['seti', 'gtir', 'eqir'];

const usesRegister = ({name, a, b, c}, register) => {
  const readsA = !immediateA.includes(name) && a === register;
  const readsB = name[3] === 'r' && !name.startsWith('set') && b === register;
  return readsA || readsB || c === register;
};

const watch = (data, onValue) => {
  const program = parse(data);
  const usages = program.instructions.filter(instruction => usesRegister(instruction, 0));
  if (usages.length !== 1 || usages[0].name !== 'eqrr') throw new Error('Register 0 is expected to be used only by a single eqrr');
  const check = usages[0];
  const register = check.a === 0 ? check.b : check.a;
  compile(program)([0, 0, 0, 0, 0, 0], program.instructions.indexOf(check), (r) => onValue(r[register]));
};

module.exports = {watch};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    // Note: the very first compared value halts the program the soonest
    watch(data, (value) => {
      console.log(value);
      return true;
    });
  });
}
