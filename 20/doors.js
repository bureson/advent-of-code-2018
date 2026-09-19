const fs = require('fs');

const directions = {
  N: {x: 0, y: -1},
  E: {x: 1, y: 0},
  S: {x: 0, y: 1},
  W: {x: -1, y: 0}
};

const key = (x, y) => `${x},${y}`;

// Note: returns the fewest number of doors to every room
const getDistances = (data) => {
  const regex = data.trim();
  // Note: room -> set of rooms behind its doors
  const doors = {[key(0, 0)]: new Set()};
  // Note: all the rooms where the route could be at the moment, branches can end in different rooms
  let current = new Set([key(0, 0)]);
  const stack = [];
  regex.split('').forEach(char => {
    if (char === '(') {
      stack.push({starts: current, ends: new Set()});
    } else if (char === '|' || char === ')') {
      const group = stack[stack.length - 1];
      current.forEach(room => group.ends.add(room));
      current = group.starts;
      if (char === ')') current = stack.pop().ends;
    } else if (directions[char]) {
      const next = new Set();
      current.forEach(room => {
        const [x, y] = room.split(',').map(Number);
        const neighbour = key(x + directions[char].x, y + directions[char].y);
        if (!doors[neighbour]) doors[neighbour] = new Set();
        doors[room].add(neighbour);
        doors[neighbour].add(room);
        next.add(neighbour);
      });
      current = next;
    }
  });
  // Note: breadth first search through the doors
  const distances = {[key(0, 0)]: 0};
  const queue = [key(0, 0)];
  for (let i = 0; i < queue.length; i++) {
    doors[queue[i]].forEach(room => {
      if (distances[room] !== undefined) return;
      distances[room] = distances[queue[i]] + 1;
      queue.push(room);
    });
  }
  return Object.values(distances);
};

module.exports = {getDistances};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    console.log(Math.max(...getDistances(data)));
  });
}
