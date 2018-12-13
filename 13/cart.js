const fs = require('fs');

const assign = (map, x, y, value) => {
  if (!map[x]) map[x] = {};
  map[x][y] = value;
}

const initialDirection = {
  '<': 'left',
  '>': 'right',
  '^': 'up',
  'v': 'down'
};

const nextTurn = {
  'right': 'left',
  'left': 'straight',
  'straight': 'right'
};

const verticalConnections = ['\\', '|', '/', '+'];
const horizontalConnections = ['\\', '-', '/', '+'];

const getDirection = (direction, turn) => {
  switch (turn) {
    case 'left':
      switch (direction) {
        case 'up':
          return 'left';
        case 'down':
          return 'right';
        case 'right':
          return 'up';
        case 'left':
          return 'down';
      };
    case 'right':
      switch (direction) {
        case 'up':
          return 'right';
        case 'down':
          return 'left';
        case 'right':
          return 'down';
        case 'left':
          return 'up';
      };
    default:
      return direction;
  };
};

const countCarts = (carts) => {
  return Object.keys(carts).reduce((sum, key) => sum + Object.values(carts[key]).length, 0);
};

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const tracks = data.split('\n').filter(x => x);
      const maxLength = Math.max(...tracks.map(track => track.length));
      let map = {};
      let carts = {};
      // Note: make carts clever and complete the map
      for (let y = 0; y < tracks.length; y++) {
        for (let x = 0; x < maxLength; x++) {
          const trackPiece = tracks[y][x];
          if (['<', '>', '^', 'v'].includes(trackPiece)) {
            const cart = {time: 0, direction: initialDirection[tracks[y][x]], lastTurn: 'right'};
            assign(carts, x, y, cart);
            let track;
            const left = tracks[y] && tracks[y][x-1];
            const right = tracks[y] && tracks[y][x+1];
            const up = tracks[y-1] && tracks[y-1][x];
            const down = tracks[y+1] && tracks[y+1][x];
            // Note: this works only because no cart was spawned on a turn or intersection
            if (horizontalConnections.includes(left) && verticalConnections.includes(up) && horizontalConnections.includes(left) && verticalConnections.includes(down)) track = '+';
            else if (verticalConnections.includes(up) && verticalConnections.includes(down)) track = '|';
            else if (horizontalConnections.includes(left) && horizontalConnections.includes(right)) track = '-';
            else if ((verticalConnections.includes(up) && horizontalConnections.includes(right)) || (verticalConnections.includes(down) && horizontalConnections.includes(left))) track = '\\';
            else if ((verticalConnections.includes(up) && horizontalConnections.includes(left)) || (verticalConnections.includes(down) && horizontalConnections.includes(right))) track = '/';
            assign(map, x, y, track);
          } else {
            assign(map, x, y, trackPiece)
          }
        }
      }
      // Note: release carts
      let time = 0;
      while (countCarts(carts) > 1) {
        ++time;
        for (let y = 0; y < tracks.length; y++) {
          for (let x = 0; x < maxLength; x++) {
            if (carts[x] && carts[x][y] && carts[x][y].time < time) {
              let newX;
              let newY;
              const cart = carts[x][y];
              cart.time = time;
              if (cart.direction === 'right') {
                newX = x+1;
                newY = y;
              } else if (cart.direction === 'left') {
                newX = x-1;
                newY = y;
              } else if (cart.direction === 'down') {
                newX = x;
                newY = y+1;
              } else if (cart.direction === 'up') {
                newX = x;
                newY = y-1;
              }
              if (carts[newX] && carts[newX][newY]) {
                delete carts[x][y];
                delete carts[newX][newY];
              } else {
                const track = map[newX][newY];
                if (track === '+') {
                  const turn = nextTurn[cart.lastTurn];
                  cart.direction = getDirection(cart.direction, turn);
                  cart.lastTurn = turn;
                } else if (track === '/') {
                  const turn = ['right', 'left'].includes(cart.direction) ? 'left' : 'right';
                  cart.direction = getDirection(cart.direction, turn);
                } else if (track === '\\') {
                  const turn = !['right', 'left'].includes(cart.direction) ? 'left' : 'right';
                  cart.direction = getDirection(cart.direction, turn);
                }
                assign(carts, newX, newY, cart);
                delete carts[x][y];
              }
            }
          }
        }
      }
      const x = Object.keys(carts).find(key => Object.values(carts[key]).length);
      const y = Object.keys(carts[x])[0];
      console.log(x, y);
    });
  });
})();
