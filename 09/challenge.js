// Note: Before solving this challenge, I wasn't aware of a concept
// of linked lists and for this solution I had to go through some articles
// and look at other players solutions. After running the script in 'game.js'
// for couple of minutes I only got to 200 thousand rounds (instead of 7 million)

const fs = require('fs');

const append = (value, marble) => {
  const appendix = {value, prev: marble, next: marble.next};
  marble.next.prev = appendix;
  marble.next = appendix;
  return appendix;
};

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.trim().split(' ');
      const players = Number(list[0]);
      const marbles = Number(list[6]) * 100;
      let scoreBoard = Array(players).fill('').reduce((map, _, i) => {
        return {...map, [i + 1]: 0};
      }, {});

      let currentMarble = {value: 0};
      currentMarble.next = currentMarble;
      currentMarble.prev = currentMarble;
      let round = 0;
      while (round < marbles) {
        const currentPlayer = round % players + 1;
        ++round;
        if (round % 23 === 0) {
          currentMarble = currentMarble.prev.prev.prev.prev.prev.prev;
          scoreBoard[currentPlayer] += round + currentMarble.prev.value;
          currentMarble.prev.prev.next = currentMarble;
          currentMarble.prev = currentMarble.prev.prev;
        } else {
          currentMarble = append(round, currentMarble.next);
        }
      }

      console.log(Math.max(...Object.values(scoreBoard)));
    });
  });
})();
