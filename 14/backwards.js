const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const input = Number(data.trim());
      let scoreBoard = [3, 7];
      let firstElf = 0;
      let secondElf = 1;
      // Note: when running any more loops than that, the script throws 'JavaScript heap out of memory'
      // and since the script below is quite fast, it is more efficient to build the scoreBoard first
      // and only then look for the index of input
      while (scoreBoard.length < 50000000) {
        firstElf = (firstElf + scoreBoard[firstElf] + 1) > (scoreBoard.length - 1) ? (firstElf + scoreBoard[firstElf] + 1) % scoreBoard.length : (firstElf + scoreBoard[firstElf] + 1);
        secondElf = (secondElf + scoreBoard[secondElf] + 1) > (scoreBoard.length - 1) ? (secondElf + scoreBoard[secondElf] + 1) % scoreBoard.length : (secondElf + scoreBoard[secondElf] + 1);
        (scoreBoard[firstElf] + scoreBoard[secondElf]).toString().split('').forEach(x => scoreBoard.push(Number(x)));
      }
      console.log(scoreBoard.join('').indexOf(input));
    });
  });
})();
