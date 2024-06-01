const urlParams = new URLSearchParams(window.location.search);

let particlesPerGroup = 200;

try {
  const v = parseInt(urlParams.get("n"));
  if (!isNaN(v))
    particlesPerGroup = v;
} catch (e) {
}

const particleSize = 3;
const maxV = 10;
const velocityFactor = 0.1; // 0.002;
const repulsionDistance = 10;
const maxInterferenceDistance = 100;
const fullForceDistance = (maxInterferenceDistance - repulsionDistance) / 2;

const canvas = document.getElementById("life");
const ctx = canvas.getContext('2d');

function* idMaker() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

const idGen = idMaker();

const particles = [];
const particlesGroups = [];

const particle = (x, y, color) => {
  return {x, y, vx: 0, vy: 0, color, id: idGen.next().value};
};

const draw = (x, y, color, size) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
};

const random = (max) => {
  const padding = max / 10;
  return Math.random() * (max - 2 * padding) + padding
};

const create = (number, color) => {
  const group = [];
  for (let i = 0; i < number; i++) {
    let p = particle(random(window.innerWidth), random(window.innerHeight), color);
    group.push(p);
    particles.push(p);
  }
  particlesGroups.push(group);
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
      } else if (d < repulsionDistance) {
        const F = 1 / d;
        fx += F * dx;
        fy += F * dy;
      } else if (d > repulsionDistance && d < maxInterferenceDistance) { // restrict distance of interference
        // mass for each particle assumed 1

        let F = 0;
        const dT = d - repulsionDistance;
        if (dT <= fullForceDistance) {
          F = -g * dT / fullForceDistance;
        } else {
          F = -g * (2 - dT / fullForceDistance);
        }

        // const F = (-g /* *1 */) / d;
        fx += F * dx;
        fy += F * dy;
      }
    }
    a.vx = (a.vx + fx);
    a.vy = (a.vy + fy);
    // limit v
    if (Math.abs(a.vx) > maxV)
      a.vx = maxV * Math.sign(a.vx);
    if (Math.abs(a.vy) > maxV)
      a.vy = maxV * Math.sign(a.vy);
  }
};

const updatePositions = () => {
  for (const a of particles) {
    // limits
    if (a.x <= 0 && Math.sign(a.vx) < 0) {
      a.vx *= -Math.max(1, -a.x);
    }
    if (a.x >= canvas.width && Math.sign(a.vx) > 0) {
      a.vx *= -Math.max(1, a.x - canvas.width);
    }
    if (a.y <= 0 && Math.sign(a.vy) < 0) {
      a.vy *= -Math.max(1, -a.y);
    }
    if (a.y >= canvas.height && Math.sign(a.vy) > 0) {
      a.vy *= -Math.max(1, a.y - canvas.height);
    }

    a.x += a.vx * velocityFactor;
    a.y += a.vy * velocityFactor;
  }
};

const updateWorldSettings = () => {
  if (canvas.height !== window.innerHeight || canvas.width !== window.innerWidth) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }
};

updateWorldSettings();

// Create Groups of particles
// const yellow = create(200, 'yellow');
// const red = create(200, 'red');

const red = create(particlesPerGroup, 'red');
const orange = create(particlesPerGroup, 'orange');
const yellow = create(particlesPerGroup, 'yellow');
const green = create(particlesPerGroup, 'lightgreen');
const cyan = create(particlesPerGroup, 'cyan');
const purple = create(particlesPerGroup, 'magenta');


const update = () => {
  // calc forces
  // calcVelocity(yellow, yellow, 1);

  // const t1 = new Date().getTime();
  // calcVelocity(red, red, 0.1); // red attracts red
  // calcVelocity(green, red, 0.04);
  // calcVelocity(red, green, -0.1);
  // calcVelocity(green, green, 0.01);

  for (let i = 0; i < particlesGroups.length; i++) {
    const particlesGroup = particlesGroups[i];
    calcVelocity(particlesGroup, particlesGroup, 1);

  }
  for (let i = 0; i < particlesGroups.length - 1; i++) {
    const particlesGroup = particlesGroups[i];
    const particlesGroup2 = particlesGroups[i + 1];
    calcVelocity(particlesGroup, particlesGroup2, -0.0003);
    calcVelocity(particlesGroup2, particlesGroup, 0.005);
  }
  for (let i = 0; i < particlesGroups.length - 2; i++) {
    const particlesGroup = particlesGroups[i];
    const particlesGroup2 = particlesGroups[i + 2];
    calcVelocity(particlesGroup, particlesGroup2, -0.000002);
  }
  for (let i = 0; i < particlesGroups.length - 3; i++) {
    const particlesGroup = particlesGroups[i];
    const particlesGroup2 = particlesGroups[i + 3];
    calcVelocity(particlesGroup, particlesGroup2, -0.000001);
  }
  for (let i = 0; i < particlesGroups.length - 4; i++) {
    const particlesGroup = particlesGroups[i];
    const particlesGroup2 = particlesGroups[i + 4];
    calcVelocity(particlesGroup, particlesGroup2, -0.0000005);
  }
  for (let i = 0; i < particlesGroups.length - 5; i++) {
    const particlesGroup = particlesGroups[i];
    const particlesGroup2 = particlesGroups[i + 5];
    calcVelocity(particlesGroup, particlesGroup2, -0.0000002);
  }

  // const t2 = new Date().getTime();
  updatePositions();
  // const t3 = new Date().getTime();

  updateWorldSettings();
  // const t4 = new Date().getTime();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw(0, 0, 'black', 500);

  for (const p of particles) {
    draw(p.x, p.y, p.color, particleSize);
  }
  // const t5 = new Date().getTime();
  // console.log(t2 - t1);

  requestAnimationFrame(update);
}

update();