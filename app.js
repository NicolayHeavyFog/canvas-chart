import getChartData from './data.js';

const WIDTH = 600, HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2, DPI_HEIGHT = HEIGHT * 2;
const ROWS_COUNT = 5;
const PADDING = 40;
const VIEW_WIDTH = DPI_WIDTH;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;

function chart(canvas, data) {
  const ctx = canvas.getContext('2d');
  canvas.style.width = WIDTH + 'px';
  canvas.style.height = HEIGHT + 'px';
  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  const [yMin, yMax] = computeBoudaries(data);
  const yRation = VIEW_HEIGHT / (yMax - yMin);
  const xRation = VIEW_WIDTH / (data.columns[0].length - 2);

  // y axis ---------
  const step = VIEW_HEIGHT / ROWS_COUNT;
  const textStep = (yMax - yMin) / ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = '#bbb';
  ctx.font = "normal 20px Helvetica,sans-serif";
  ctx.fillStyle = '#96a2aa';
  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = step * i;
    const text = yMax - textStep * i;

    ctx.fillText(Math.round(text.toString()), 10, y + PADDING - 10);
    ctx.moveTo(0, y + PADDING);
    ctx.lineTo(DPI_WIDTH, y + PADDING)
  }
  ctx.stroke();
  ctx.closePath();

  // ---------

  data.columns.forEach(col => {
    const name = col[0];
    if (data.types[name] === 'line') {
      const coords = col.map((y, i) => [
          Math.floor((i - 1) * xRation),
          Math.floor(DPI_HEIGHT - PADDING - y * yRation)
        ]
      ).filter((_, i) => i !== 0);

      const color = data.colors[name]
      line(ctx, coords, { color })
    }
  })
}

function line(ctx, coords, { color }) {
  ctx.beginPath()
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  for(const [x,y] of coords) {
    // ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRation)
    ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.closePath()
}

function computeBoudaries({columns, types}) {
  let min = null, max = null;

  columns.forEach(col => {
    if (types[col[0]] !== 'line') {
      return;
    }

    if (typeof min !== 'number') min = col[1];
    if (typeof min !== 'number') max = col[1];

    // if (min > y) min = y;
    // if (max < y) max = y;

    for (let i = 2; i < col.length; i++) {
      if (min > col[i]) min = col[i];
      if (max < col[i]) max = col[i];
    }
  })

  // for (let [, y] of data) {
  //   if (typeof min !== 'number') min = y;
  //   if (typeof min !== 'number') max = y;
  //   if (min > y) min = y;
  //   if (max < y) max = y;
  // }
  return [min, max];
}

chart(document.getElementById('chart'), getChartData())

