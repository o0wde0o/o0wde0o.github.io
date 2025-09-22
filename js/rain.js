const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.cssText = "position:fixed;top:0;left:0;z-index:-1;pointer-events:none;";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const drops = Array(300).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  l: Math.random() * 1.5 + 0.5,
  xs: -4 + Math.random() * 4 + 2,
  ys: Math.random() * 10 + 10
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(174,194,224,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.l * d.xs, d.y + d.l * d.ys);
  }
  ctx.stroke();
  move();
}

function move() {
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    d.x += d.xs;
    d.y += d.ys;
    if (d.x > canvas.width || d.y > canvas.height) {
      d.x = Math.random() * canvas.width;
      d.y = -20;
    }
  }
}

setInterval(draw, 30);
