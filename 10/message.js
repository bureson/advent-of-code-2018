// Note: open index.html in your browser, load your input file with the file
// input and wait for the message to form on your screen

let time = 1;
let diffX = 1000000;
let diffY = 1000000;

let canvasHeight = 1000;
let canvasWidth = 1000;

const timeContainer = document.getElementById('time');

const init = () => {
  const oldCanvas = document.getElementById('message');
  if (oldCanvas) oldCanvas.remove();
  const canvas = document.createElement('canvas');
  canvas.id = 'message';
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  document.body.appendChild(canvas);
  const newCanvas = document.getElementById('message');
  this.ctx = newCanvas.getContext('2d');
  this.canvasData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  timeContainer.innerHTML = `Time: ${time}`;
}

const readSingleFile = (e) => {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = (e) => parseData(e.target.result);
  reader.readAsText(file);
}

const drawPixel = (x, y) => {
  var index = (x + y * canvasWidth) * 4;
  this.canvasData.data[index + 0] = 0;
  this.canvasData.data[index + 1] = 0;
  this.canvasData.data[index + 2] = 0;
  this.canvasData.data[index + 3] = 255;
}

const updateCanvas = () => {
  this.ctx.putImageData(this.canvasData, 0, 0);
}

const parseLine = (line) => {
  const [x, y] = line.split('<')[1].split('>')[0].split(',').map(x => Number(x.trim()));
  const [vX, vY] = line.split('<')[2].split('>')[0].split(',').map(x => Number(x.trim()) * time);
  return {x, y, vX, vY};
}

const draw = (list) => {
  const map = list.map(line => {
    const {x, y, vX, vY} = parseLine(line);
    return [x + vX, y + vY];
  });
  const minX = Math.min(...map.map(x => x[0]));
  const maxX = Math.max(...map.map(x => x[0]));
  const localDiffX = maxX - minX;
  const minY = Math.min(...map.map(x => x[1]));
  const maxY = Math.max(...map.map(x => x[1]));
  const localDiffY = maxY - minY;
  if (localDiffX < diffX && localDiffY < diffY) {
    init();
    diffX = localDiffX;
    diffY = localDiffY;
    list.forEach(line => {
      const {x, y, vX, vY} = parseLine(line);
      const pointX = Math.round(x + vX);
      const pointY = Math.round(y + vY);
      drawPixel(pointX, pointY);
    });
    updateCanvas();
    setTimeout(function () {
      time += Math.ceil(localDiffX / 1000); // Note: this is just to make things fancy
      draw(list);
    }, 1);
  }
}

const parseData = (data) => {
  const list = data.trim().split('\r\n');
  draw(list);
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);
