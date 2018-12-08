const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let metaData = [];
      const list = data.trim().split(' ').map(x => Number(x));

      const getChildLength = (index) => {
        let totalLength = 0;
        const childCount = list[index];
        const metaCount = list[index + 1];
        for (let i = 0; i < childCount; i++) {
          totalLength += getChildLength(index + 2 + totalLength);
        }
        const childMetaData = list.slice(index + 2 + totalLength, index + 2 + totalLength + metaCount);
        metaData = [...metaData, ...childMetaData];
        return 2 + totalLength + metaCount;
      };

      const length = getChildLength(0);
      metaData = [...metaData, ...list.slice(2 + length)];
      console.log(metaData.reduce((sum, x) => sum + x));
    });
  });
})();
