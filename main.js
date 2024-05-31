let canvas = document.getElementById("life");
const ctx = canvas.getContext('2d');

const dim = 500;
const maxV = Math.floor(dim / 4);
const velocityFactor = 0.5;
const repulsionDistance = 10;
const maxInterferenceDistance = 80;

function* idMaker() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

const idGen = idMaker();

const particles = [];
const particle = (x, y, color) => {
  return {x, y, vx: 0, vy: 0, color, id: idGen.next().value};
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

const calcVelocity = (particlesGroup1, particlesGroup2, g) => {
  for (let i = 0; i < particlesGroup1.length; i++) {
    let fx = 0;
    let fy = 0;
    const a = particlesGroup1[i];

    for (let j = 0; j < particlesGroup2.length; j++) {
      const b = particlesGroup2[j];

      // Don't interact with your self
      if (a.id === b.id)
        continue;

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= 0) {
        fx += Math.random();
        fy += Math.random();
      } else if (d <= repulsionDistance) {
        const F = 1 / d;
        fx += F * dx;
        fy += F * dy;
      } else if (d > repulsionDistance && d < maxInterferenceDistance) {// restrict distance of interference
        // mass for each particle assumed 1
        const F = (-g /* *1 */) / d;
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
  }
};

const updatePositions = () => {
  for (const a of particles) {
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

// Create Groups of particles
// const yellow = create(200, 'yellow');
const red = create(200, 'red');
const green = create(200, 'green');

const update = () => {
  // calc forces
  // calcVelocity(yellow, yellow, -0.1);


  calcVelocity(red, red, 0.1); // red attracts red
  calcVelocity(green, red, 0.04);
  calcVelocity(red, green, -0.1);

  updatePositions();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(0, 0, 'black', 500);

  for (const p of particles) {
    draw(p.x, p.y, p.color, 5);
  }

  requestAnimationFrame(update);
}

update();