let canvas = document.getElementById("life");
const ctx = canvas.getContext('2d');

const dim = 500;
const maxV = Math.floor(dim / 4);
const velocityFactor = 0.1;

const particles = [];
const particle = (x, y, color) => {
  return {x, y, vx: 0, vy: 0, color};
};

const draw = (x, y, color, size) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
};
const random = () => {
  const padding = dim / 10;
  return Math.random() * (dim - 2 * padding) + padding
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

const rule = (atoms1, atoms2, g) => {
  for (let i = 0; i < atoms1.length; i++) {
    let fx = 0;
    let fy = 0;
    const a = atoms1[i];

    for (let j = 0; j < atoms2.length; j++) {
      const b = atoms2[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < 80) {// restrict distance of interference
        // mass for each particle assumed 1
        const F = (g * 1) / d;
        fx += F * dx;
        fy += F * dy;
      }
    }
    a.vx = (a.vx + fx) * velocityFactor;
    a.vy = (a.vy + fy) * velocityFactor;
    // limit v
    if (Math.abs(a.vx) > maxV)
      a.vx = maxV * Math.sign(a.vx);
    if (Math.abs(a.vy) > maxV)
      a.vy = maxV * Math.sign(a.vy);


    a.x += a.vx;
    a.y += a.vy;

    // limits
    if (a.x <= 0 && Math.sign(a.vx) < 0) {
      a.vx *= -1;
    }
    if (a.x >= 500 && Math.sign(a.vx) > 0) {
      a.vx *= -1;
    }
    if (a.y <= 0 && Math.sign(a.vy) < 0) {
      a.vy *= -1;
    }
    if (a.y >= 500 && Math.sign(a.vy) > 0) {
      a.vy *= -1;
    }
  }
};

const yellow = create(200, 'yellow');
const red = create(200, 'red');
const green = create(200, 'green');

const update = () => {
  // calc forces
  // rule(red, red, -0.1); // red attracts red
  // rule(red, yellow, -0.01);
  // rule(yellow, red, 0.01);

  rule(green, green, -0.32);
  rule(green, red, -0.17);
  rule(green, yellow, 0.34);

  rule(red, red, -0.1); // red attracts red
  rule(red, green, -0.34);

  rule(yellow, yellow, 0.15);
  rule(yellow, green, -0.2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(0, 0, 'black', 500);

  for (const p of particles) {
    draw(p.x, p.y, p.color, 5);
  }

  requestAnimationFrame(update);
}

update();