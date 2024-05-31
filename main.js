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

const rule = (particles1, particles2, g) => {
  for (let i = 0; i < particles1.length; i++) {
    const a = particles1[i];

    let fx = 0;
    let fy = 0;

    for (let j = 0; j < particles2.length; j++) {
      const b = particles1[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < 80) { // restrict distance of interference
        // mass for each particle assumed 1
        const F = g * 1 / d;
        fx += (F * dx);
        fy += (F * dy);
      }
    }

    a.vx = (a.vx + fx) * 0.5;
    a.vy = (a.vy + fy) * 0.5;
    a.x += a.vx;
    a.y += a.vy;

    //borders
    if (a.x <= 0 || a.x >= 500)
      a.vx *= -1;
    if (a.y <= 0 || a.y >= 500)
      a.vy *= -1;
  }
};

const yellow = create(200, 'yellow');

const update = () => {
  rule(yellow, yellow, 1); // calc forces

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(0, 0, 'black', 500);

  for (const p of particles) {
    draw(p.x, p.y, p.color, 5);
  }

  requestAnimationFrame(update);
}

update();