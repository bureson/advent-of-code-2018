const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const input = Number(data.trim());
      let scoreBoard = [3, 7];
      let firstElf = 0;
      let secondElf = 1;
      while (scoreBoard.length < (input + 11)) {
        firstElf = (firstElf + scoreBoard[firstElf] + 1) % scoreBoard.length;
        secondElf = (secondElf + scoreBoard[secondElf] + 1) % scoreBoard.length;
        (scoreBoard[firstElf] + scoreBoard[secondElf]).toString().split('').forEach(x => scoreBoard.push(Number(x)));
      }
      console.log(scoreBoard.slice(input, input + 10).join(''));
    });
  });
})();
