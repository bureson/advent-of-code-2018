const fs = require('fs');

(function () {
  fs.open('./input.txt', 'r', (err, file) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      const list = data.trim().split(' ').map(x => Number(x));

      const getChildLengthAndValue = (index) => {
        let value = {};
        let length = 0;
        const childCount = list[index];
        const metaCount = list[index + 1];
        for (let i = 0; i < childCount; i++) {
          const {l, v} = getChildLengthAndValue(index + 2 + length);
          length += l;
          value[i] = v;
        }
        const childMetaData = list.slice(index + 2 + length, index + 2 + length + metaCount);
        const metaValue = childMetaData.reduce((sum, meta) => sum + (childCount ? (value[meta - 1] || 0) : meta), 0);
        return {l: 2 + length + metaCount, v: metaValue};
      };

      const {v} = getChildLengthAndValue(0);
      console.log(v);
    });
  });
})();
