const fs = require('fs');

const wall = '#';
const open = '.';
const elf = 'E';
const goblin = 'G';

// Note: the order matters - up, left, right, down is the reading order
const neighbours = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];

const readingOrder = (a, b) => a.y - b.y || a.x - b.x;

const parse = (data, elfPower) => {
  const units = [];
  const map = data.split(/\r?\n/).filter(x => x).map((row, y) => row.split('').map((tile, x) => {
    if (tile !== elf && tile !== goblin) return tile;
    units.push({type: tile, x, y, hp: 200, power: tile === elf ? elfPower : 3});
    return open;
  }));
  return {map, units};
};

const simulate = (data, elfPower = 3, stopOnElfDeath = false) => {
  const {map, units} = parse(data, elfPower);
  const key = ({x, y}) => `${x},${y}`;
  const isFree = (position, occupied) => map[position.y][position.x] !== wall && !occupied.has(key(position));
  const getAdjacent = ({x, y}) => neighbours.map(step => ({x: x + step.x, y: y + step.y}));

  // Note: breadth first search, distance to every reachable free square
  const getDistances = (from, occupied) => {
    const distances = {[key(from)]: 0};
    const queue = [from];
    for (let i = 0; i < queue.length; i++) {
      getAdjacent(queue[i]).forEach(position => {
        if (distances[key(position)] !== undefined || !isFree(position, occupied)) return;
        distances[key(position)] = distances[key(queue[i])] + 1;
        queue.push(position);
      });
    }
    return distances;
  };

  const getInRange = (unit, targets) => targets.filter(target => Math.abs(target.x - unit.x) + Math.abs(target.y - unit.y) === 1);

  const move = (unit, targets) => {
    const occupied = new Set(units.filter(other => other.hp > 0).map(key));
    const distances = getDistances(unit, occupied);
    const destination = targets
      .reduce((squares, target) => [...squares, ...getAdjacent(target)], [])
      .filter(square => distances[key(square)] !== undefined)
      .sort((a, b) => distances[key(a)] - distances[key(b)] || readingOrder(a, b))[0];
    if (!destination) return;
    // Note: search back from the destination, so the first best step in reading order can be picked
    const stepDistances = getDistances(destination, occupied);
    let step;
    getAdjacent(unit).forEach(position => {
      const distance = stepDistances[key(position)];
      if (distance === undefined) return;
      if (!step || distance < stepDistances[key(step)]) step = position;
    });
    unit.x = step.x;
    unit.y = step.y;
  };

  let rounds = 0;
  while (true) {
    units.sort(readingOrder);
    for (const unit of units) {
      if (unit.hp <= 0) continue;
      const targets = units.filter(other => other.hp > 0 && other.type !== unit.type);
      if (!targets.length) {
        const hp = units.filter(other => other.hp > 0).reduce((sum, other) => sum + other.hp, 0);
        return {rounds, hp, outcome: rounds * hp, winner: unit.type, elfDied: false};
      }
      if (!getInRange(unit, targets).length) move(unit, targets);
      const target = getInRange(unit, targets).sort((a, b) => a.hp - b.hp || readingOrder(a, b))[0];
      if (!target) continue;
      target.hp -= unit.power;
      if (target.hp <= 0 && target.type === elf && stopOnElfDeath) return {elfDied: true};
    }
    ++rounds;
  }
};

module.exports = {simulate};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {rounds, hp, outcome} = simulate(data);
    console.log(rounds, hp, outcome);
  });
}
