const fs = require('fs');

const generateAlphabet = (charA, charZ) => {
  const aPos = charA.charCodeAt(0);
  const zPos = charZ.charCodeAt(0);
  return [...Array(zPos - aPos + 1)].map((x, i) => String.fromCharCode(aPos + i));
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const letters = data.trim().split('');
      const alphabet = generateAlphabet('a', 'z');
      const map = alphabet.map(l => {
        let replacements = true;
        let localLetters = letters.filter(x => ![x, x.toLowerCase()].includes(l));
        while (replacements) {
          replacements = false;
          for (let i = 0; i < localLetters.length - 1; i++) {
            const letter = localLetters[i];
            const nextLetter = localLetters[i + 1];
            const caseNotEquals = letter !== nextLetter;
            const letterEquals = letter && nextLetter && letter.toLowerCase() === nextLetter || letter === nextLetter.toLowerCase();
            if (letterEquals && caseNotEquals) {
              localLetters = localLetters.filter((x, index) => ![i, i + 1].includes(index));;
              replacements = true;
              break;
            }
          }
        }
        return localLetters.length;
      }).sort().reverse();
      console.log(map[0]);
    });
  });
})();
