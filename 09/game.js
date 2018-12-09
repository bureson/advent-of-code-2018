const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.trim().split(' ');
      const players = Number(list[0]);
      const marbles = Number(list[6]);
      let scoreBoard = Array(players).fill('').reduce((map, _, i) => {
        return {...map, [i + 1]: 0};
      }, {});
      let playBoard = [0];
      let round = 0;
      let currentMarble = 0;
      while (round < marbles) {
        const currentPlayer = round % players + 1;
        ++round;
        if (round % 23 === 0) {
          const proposedSteal = currentMarble - 7;
          currentMarble = proposedSteal < 0 ? playBoard.length + proposedSteal : proposedSteal;
          scoreBoard[currentPlayer] = scoreBoard[currentPlayer] + round + playBoard[currentMarble];
          playBoard = [
            ...playBoard.slice(0, currentMarble),
            ...playBoard.slice(currentMarble + 1)
          ]
        } else {
          const proposedNextMarble = currentMarble + 2;
          currentMarble = proposedNextMarble > playBoard.length ? (proposedNextMarble - playBoard.length) : proposedNextMarble;
          playBoard = [
            ...playBoard.slice(0, currentMarble),
            round,
            ...playBoard.slice(currentMarble)
          ]
        }
      }
      console.log(Math.max(...Object.values(scoreBoard)));
    });
  });
})();
