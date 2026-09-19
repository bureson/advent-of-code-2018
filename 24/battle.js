const fs = require('fs');

const immuneSystem = 'Immune System';
const infection = 'Infection';

const parse = (data) => {
  // Note: examples on the web have groups wrapped to two lines, continuation starts with a space
  const lines = data.replace(/\r?\n +/g, ' ').split(/\r?\n/).filter(x => x.trim());
  const groups = [];
  let army;
  lines.forEach(line => {
    if (line.endsWith(':')) {
      army = line.slice(0, -1);
      return;
    }
    const [units, hp, damage, initiative] = line.match(/\d+/g).map(Number);
    const getTypes = (kind) => {
      const match = line.match(new RegExp(`${kind} to ([^;)]*)`));
      return match ? match[1].split(',').map(type => type.trim()) : [];
    };
    groups.push({
      army, units, hp, damage, initiative,
      type: line.match(/(\w+) damage/)[1],
      weak: getTypes('weak'),
      immune: getTypes('immune')
    });
  });
  return groups;
};

const getPower = (group) => group.units * group.damage;

const getDamage = (attacker, defender) => {
  if (defender.immune.includes(attacker.type)) return 0;
  return getPower(attacker) * (defender.weak.includes(attacker.type) ? 2 : 1);
};

const fight = (data, boost = 0) => {
  let groups = parse(data);
  groups.filter(group => group.army === immuneSystem).forEach(group => group.damage += boost);
  while (new Set(groups.map(group => group.army)).size > 1) {
    // Note: target selection
    const targets = new Map();
    [...groups].sort((a, b) => getPower(b) - getPower(a) || b.initiative - a.initiative).forEach(attacker => {
      const chosen = [...targets.values()];
      const target = groups
        .filter(defender => defender.army !== attacker.army && !chosen.includes(defender) && getDamage(attacker, defender) > 0)
        .sort((a, b) => getDamage(attacker, b) - getDamage(attacker, a) || getPower(b) - getPower(a) || b.initiative - a.initiative)[0];
      if (target) targets.set(attacker, target);
    });
    // Note: attacking
    let killed = 0;
    [...groups].sort((a, b) => b.initiative - a.initiative).forEach(attacker => {
      const target = targets.get(attacker);
      if (!target || attacker.units <= 0) return;
      const kills = Math.min(target.units, Math.floor(getDamage(attacker, target) / target.hp));
      target.units -= kills;
      killed += kills;
    });
    // Note: nobody is able to kill anybody anymore, the fight would never end
    if (!killed) return {winner: null, units: 0};
    groups = groups.filter(group => group.units > 0);
  }
  return {winner: groups[0].army, units: groups.reduce((sum, group) => sum + group.units, 0)};
};

module.exports = {fight, immuneSystem, infection};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {winner, units} = fight(data);
    console.log(winner, units);
  });
}
