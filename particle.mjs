import {getNextId} from "./utils.mjs";
import {Settings} from "./settings.mjs";
import {getRule} from "./rule.mjs";

const wrapWorld = Settings.wrapWorld;
const maxInterferenceDistance = Settings.maxInterferenceDistance;
const velocityFactor = Settings.velocityFactor;
const maxV = Settings.maxV;
const particleSize = Settings.particleSize;
const repulsionDistance = Settings.repulsionDistance;
const fullForceDistance = Settings.fullForceDistance;

const particles = [];


class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.type = type; // = color
    this.id = getNextId();
    particles.push(this);
  }

  resetForce() {
    this.fx = 0;
    this.fy = 0;
  }

  updateVelocity() {
    this.vx += this.fx;
    this.vy += this.fy;
    // limit v

    if (Math.abs(this.vx) > maxV)
      this.vx = maxV * Math.sign(this.vx);
    if (Math.abs(this.vy) > maxV)
      this.vy = maxV * Math.sign(this.vy);
  }

  updatePosition(worldWidth, worldHeight) {
    if (!wrapWorld) {
      // limits
      if (this.x <= 0 && Math.sign(this.vx) < 0) {
        this.vx *= -Math.max(1, -this.x);
      }
      if (this.x >= worldWidth && Math.sign(this.vx) > 0) {
        this.vx *= -Math.max(1, this.x - worldWidth);
      }
      if (this.y <= 0 && Math.sign(this.vy) < 0) {
        this.vy *= -Math.max(1, -this.y);
      }
      if (this.y >= worldHeight && Math.sign(this.vy) > 0) {
        this.vy *= -Math.max(1, this.y - worldHeight);
      }
    }


    this.x += this.vx * velocityFactor;
    this.y += this.vy * velocityFactor;

    if (wrapWorld) {
      // wrap around
      this.x = (this.x + worldWidth) % worldWidth;
      this.y = (this.y + worldHeight) % worldHeight;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.type;
    ctx.fillRect(this.x, this.y, particleSize, particleSize);
  }
}


const updateForce = (particle1, particle2, worldWidth, worldHeight, worldWidth2, worldHeight2) => {
  // Don't interact with your self
  if (particle1.id === particle2.id)
    return;

  let dx = particle1.x - particle2.x;
  let dy = particle1.y - particle2.y;

  if (wrapWorld && Math.abs(dx) > worldWidth2)
    dx -= worldWidth * Math.sign(dx);
  if (wrapWorld && Math.abs(dy) > worldHeight2)
    dy -= worldHeight * Math.sign(dy);

  const d = Math.sqrt(dx * dx + dy * dy);

  if (d <= 0) {
    particle1.fx += Math.random();
    particle1.fy += Math.random();
    particle2.fx += Math.random();
    particle2.fy += Math.random();
    return;
  } else {

    if (d > maxInterferenceDistance)// restrict distance of interference
      return;
    else if (d === repulsionDistance) // no resulting force
      return;
  }


  if (d < repulsionDistance) {
    const F = 5 / d;
    particle1.fx += F * dx;
    particle1.fy += F * dy;
    particle2.fx -= F * dx;
    particle2.fy -= F * dy;
  } else if (d > repulsionDistance) {
    const r = getRule(particle1.type, particle2.type);
    const r2 = getRule(particle2.type, particle1.type);
    // mass for each particle assumed 1

    let f = 0;
    let f2 = 0;
    const dT = d - repulsionDistance;

    if (dT <= fullForceDistance) {
      if (r)
        f = -r.attraction * dT / fullForceDistance;
      if (r2)
        f2 = -r2.attraction * dT / fullForceDistance;
    } else {
      if (r)
        f = -r.attraction * (2 - dT / fullForceDistance);
      if (r2)
        f2 = -r2.attraction * (2 - dT / fullForceDistance);
    }

    // const f = (-g /* *1 */) / d;
    particle1.fx += f * dx;
    particle1.fy += f * dy;
    particle2.fx -= f2 * dx;
    particle2.fy -= f2 * dy;
  }
};

const updateParticles = (worldWidth, worldHeight) => {
  // reset force
  for (const particle of particles) {
    particle.resetForce();
  }

  // calc force
  const worldWidth2 = worldWidth * 0.5
  const worldHeight2 = worldHeight * 0.5
  for (let i = 0; i < particles.length - 1; i++) {
    const particle1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const particle2 = particles[j];
      updateForce(particle1, particle2, worldWidth, worldHeight, worldWidth2, worldHeight2);
    }
  }

  // update velocity / position
  for (const particle of particles) {
    particle.updateVelocity();
    particle.updatePosition(worldWidth, worldHeight);
  }
};

const drawParticles = (ctx) => {
  for (const particle of particles) {
    particle.draw(ctx);
  }
}

export {Particle, particles, updateParticles, drawParticles};