const fs = require('fs');
const {createCave} = require('./risk');

// Note: tools are numbered so that tool N cannot be used in region of type N
// rocky (0) - neither, wet (1) - torch, narrow (2) - climbing gear
const neither = 0;
const torch = 1;
const gear = 2;

const neighbours = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];

const rescue = (data) => {
  const {target, getType} = createCave(data);
  const key = ({x, y, tool}) => `${x},${y},${tool}`;
  // Note: dijkstra, minutes are small whole numbers, so states wait in a list for every minute
  // instead of a priority queue
  const best = {};
  const queue = [];
  const add = (state, minutes) => {
    if (best[key(state)] !== undefined && best[key(state)] <= minutes) return;
    best[key(state)] = minutes;
    if (!queue[minutes]) queue[minutes] = [];
    queue[minutes].push(state);
  };
  add({x: 0, y: 0, tool: torch}, 0);
  for (let minutes = 0; minutes < queue.length; minutes++) {
    for (const state of queue[minutes] || []) {
      // Note: outdated, the same state was reached faster in the meantime
      if (best[key(state)] < minutes) continue;
      const {x, y, tool} = state;
      if (x === target.x && y === target.y && tool === torch) return minutes;
      const type = getType(x, y);
      // Note: there is always just one other tool allowed in the region
      add({x, y, tool: [neither, torch, gear].find(other => other !== tool && other !== type)}, minutes + 7);
      neighbours.forEach(step => {
        const next = {x: x + step.x, y: y + step.y, tool};
        if (next.x < 0 || next.y < 0 || getType(next.x, next.y) === tool) return;
        add(next, minutes + 1);
      });
    }
  }
};

module.exports = {rescue};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    console.log(rescue(data));
  });
}
