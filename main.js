let canvas = document.getElementById("life");
const ctx = canvas.getContext('2d');

const draw = (x, y, color, size) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
};

const particles = [];
const particle = (x, y, color) => {
  return {x, y, vx: 0, vy: 0, color};
};

const random = () => {
  return Math.random() * 400 + 50
};

const create = (number, color) => {
  const group = [];
  for (let i = 0; i < number; i++) {
    let p = particle(random(), random(), color);
    group.push(p);
    particles.push(p);
  }
  return group;
};

const yellow = create(200, 'yellow');

const update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(0, 0, 'black', 500);

  for (const p of particles) {
    draw(p.x, p.y, p.color, 5);
  }

  requestAnimationFrame(update);
}

update();