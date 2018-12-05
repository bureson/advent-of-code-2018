const fs = require('fs');

const generateAlphabet = (charA, charZ) => {
  const aPos = charA.charCodeAt(0);
  const zPos = charZ.charCodeAt(0);
  return [...Array(zPos - aPos + 1)].map((x, i) => String.fromCharCode(aPos + i));
}

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const letters = data.trim();
      const alphabet = generateAlphabet('a', 'z');
      const map = alphabet.map(l => {
        let replacements = true;
        const replaceLowercase = new RegExp(l, 'g');
        const replaceUppercase = new RegExp(l.toUpperCase(), 'g');
        let localLetters = letters.replace(replaceLowercase, '').replace(replaceUppercase, '');
        while (replacements) {
          replacements = false;
          for (let i = 0; i < localLetters.length - 1; i++) {
            const letter = localLetters[i];
            const nextLetter = localLetters[i + 1];
            const letterEquals = letter.toLowerCase() === nextLetter || letter === nextLetter.toLowerCase();
            const caseNotEquals = letter !== nextLetter;
            if (letterEquals && caseNotEquals) {
              localLetters = localLetters.slice(0, i) + localLetters.slice(i + 2);
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
