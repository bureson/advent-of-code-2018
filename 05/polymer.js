const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let x = 0;
      let replacements = true;
      let letters = data.trim();
      while (replacements) {
        x++;
        replacements = false;
        for (let i = 0; i < letters.length - 1; i++) {
          const letter = letters[i];
          const nextLetter = letters[i + 1];
          const caseNotEquals = letter !== nextLetter;
          const letterEquals = letter.toLowerCase() === nextLetter || letter === nextLetter.toLowerCase();
          if (letterEquals && caseNotEquals) {
            letters = letters.slice(0, i) + letters.slice(i + 2);
            replacements = true;
            break;
          }
        }
      }
      console.log(letters.length);
    });
  });
})();
