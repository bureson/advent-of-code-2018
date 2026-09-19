const fs = require('fs');

const axes = ['x', 'y', 'z'];

// Note: manhattan distance from a point to the closest point of a box, 0 when the point is inside
const getDistance = (point, box) => axes.reduce((sum, axis) => {
  const min = box[axis];
  const max = box[axis] + box.size - 1;
  return sum + Math.max(min - point[axis], 0, point[axis] - max);
}, 0);

// Note: most bots in range first, then closest to 0,0,0, then the smallest box
const compare = (a, b) => b.count - a.count || a.distance - b.distance || a.size - b.size;

// Note: binary heap, the best box is always at index 0
const push = (heap, box) => {
  heap.push(box);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (compare(heap[i], heap[parent]) >= 0) break;
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
};

const pop = (heap) => {
  const top = heap[0];
  const last = heap.pop();
  if (heap.length) {
    heap[0] = last;
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = left + 1;
      let best = i;
      if (left < heap.length && compare(heap[left], heap[best]) < 0) best = left;
      if (right < heap.length && compare(heap[right], heap[best]) < 0) best = right;
      if (best === i) break;
      [heap[i], heap[best]] = [heap[best], heap[i]];
      i = best;
    }
  }
  return top;
};

const find = (data) => {
  const bots = data.split(/\r?\n/).filter(x => !!x).map(line => {
    const [x, y, z, r] = line.match(/-?\d+/g).map(c => Number(c));
    return {x, y, z, r};
  });
  const origin = {x: 0, y: 0, z: 0};
  // Note: count of bots in range of any part of the box, no point inside of the box can have more
  const createBox = (x, y, z, size) => {
    const box = {x, y, z, size};
    box.count = bots.filter(bot => getDistance(bot, box) <= bot.r).length;
    box.distance = getDistance(origin, box);
    return box;
  };
  // Note: start with a box big enough for every bot including its range, size is a power of 2
  const reach = Math.max(...bots.map(bot => Math.max(...axes.map(axis => Math.abs(bot[axis]))) + bot.r));
  let size = 1;
  while (size <= reach) size *= 2;
  const heap = [];
  push(heap, createBox(-size, -size, -size, size * 2));
  while (heap.length) {
    const box = pop(heap);
    // Note: a single coordinate which beat every other box, that is the answer
    if (box.size === 1) return box;
    const half = box.size / 2;
    [0, half].forEach(dx => [0, half].forEach(dy => [0, half].forEach(dz => {
      push(heap, createBox(box.x + dx, box.y + dy, box.z + dz, half));
    })));
  }
};

module.exports = {find};

if (require.main === module) {
  fs.readFile(process.argv[2] || './input.txt', {encoding: 'utf-8'}, (err, data) => {
    const {x, y, z, count, distance} = find(data);
    console.log(x, y, z, count, distance);
  });
}
