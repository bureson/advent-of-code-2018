// Note: every opcode as a javascript expression, r = registers
const expressions = {
  addr: (a, b) => `r[${a}] + r[${b}]`,
  addi: (a, b) => `r[${a}] + ${b}`,
  mulr: (a, b) => `r[${a}] * r[${b}]`,
  muli: (a, b) => `r[${a}] * ${b}`,
  banr: (a, b) => `r[${a}] & r[${b}]`,
  bani: (a, b) => `r[${a}] & ${b}`,
  borr: (a, b) => `r[${a}] | r[${b}]`,
  bori: (a, b) => `r[${a}] | ${b}`,
  setr: (a) => `r[${a}]`,
  seti: (a) => `${a}`,
  gtir: (a, b) => `${a} > r[${b}] ? 1 : 0`,
  gtri: (a, b) => `r[${a}] > ${b} ? 1 : 0`,
  gtrr: (a, b) => `r[${a}] > r[${b}] ? 1 : 0`,
  eqir: (a, b) => `${a} === r[${b}] ? 1 : 0`,
  eqri: (a, b) => `r[${a}] === ${b} ? 1 : 0`,
  eqrr: (a, b) => `r[${a}] === r[${b}] ? 1 : 0`
};

const parse = (data) => {
  const lines = data.split(/\r?\n/).filter(x => x);
  const ipRegister = Number(lines.find(line => line.startsWith('#ip')).match(/\d+/)[0]);
  const instructions = lines.filter(line => !line.startsWith('#')).map(line => {
    const [name, ...values] = line.split(' ');
    const [a, b, c] = values.map(Number);
    return {name, a, b, c};
  });
  return {ipRegister, instructions};
};

// Note: interpreting is too slow for day 21, so the program is turned into one big switch.
// Instruction which does not write to the bound register just falls through to the next case.
// Returned function runs until the program halts or until onBreak called at breakIp returns true.
const compile = ({ipRegister, instructions}) => {
  const cases = instructions.map(({name, a, b, c}, i) => {
    const hook = `if (${i} === breakIp) { r[${ipRegister}] = ${i}; if (onBreak(r)) return r; }`;
    const execute = `r[${ipRegister}] = ${i}; r[${c}] = ${expressions[name](a, b)};`;
    const jump = c === ipRegister ? `ip = r[${ipRegister}] + 1; break;` : '';
    return `case ${i}: ${hook} ${execute} ${jump}`;
  });
  const body = `
    let ip = 0;
    while (true) {
      switch (ip) {
        ${cases.join('\n        ')}
        default: return r;
      }
    }`;
  const run = new Function('r', 'breakIp', 'onBreak', body);
  return (registers = [0, 0, 0, 0, 0, 0], breakIp = -1, onBreak = () => false) => run([...registers], breakIp, onBreak);
};

module.exports = {parse, compile};
