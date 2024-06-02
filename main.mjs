import {drawParticles, Particle, updateParticles} from "./particle.mjs";
import {Settings} from "./settings.mjs";
import {typeList, Types} from "./type.mjs";
import {createRule, createRules, createRuleSelf} from "./rule.mjs";

const canvas = document.getElementById("life");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
  }
};

const random = (max) => {
  const padding = max / (Settings.wrapWorld ? 100 : 10);
  return Math.random() * (max - 2 * padding) + padding
};

const createParticles = (number, color) => {
  for (let i = 0; i < number; i++) {
    // at top/bottom/left/right
    // const p = particle(window.innerWidth / 2 + (window.innerWidth / 2 - 20) * Math.sign(Math.random() - 0.5) /*random(window.innerWidth)*/, window.innerHeight / 2 + (window.innerHeight / 2 - 20) * Math.sign(Math.random() - 0.5) /* random(window.innerHeight)*/, color);
    new Particle(random(window.innerWidth), random(window.innerHeight), color);
  }
};

updateWorldSettings();

// Create Groups of particles

createParticles(Settings.particlesPerGroup, Types.red);
createParticles(Settings.particlesPerGroup, Types.orange);
createParticles(Settings.particlesPerGroup, Types.yellow);
createParticles(Settings.particlesPerGroup, Types.green);
createParticles(Settings.particlesPerGroup, Types.blue);
createParticles(Settings.particlesPerGroup, Types.purple);

createParticles(Settings.particlesPerGroup, "magenta");
createParticles(Settings.particlesPerGroup, "white");

// Self attraction
// createRuleSelf(Types.red, 1);

for (let i = 0; i < typeList.length; i++) {
  createRuleSelf(typeList[i], 1);
}


createRule("magenta", Types.yellow, 0.5);
// createRules(Types.red, Types.orange, -0.1, 0.5);


for (let i = 0; i < typeList.length - 1; i++) {
  createRules(typeList[i], typeList[i + 1], -0.031, 0.035);
}

for (let i = 0; i < typeList.length - 2; i++) {
  createRule(typeList[i + 2], typeList[i], -0.01);
}
for (let i = 0; i < typeList.length - 3; i++) {
  createRule(typeList[i + 3], typeList[i], -0.01);
}
for (let i = 0; i < typeList.length - 4; i++) {
  createRule(typeList[i + 4], typeList[i], -0.01);
}
for (let i = 0; i < typeList.length - 5; i++) {
  createRule(typeList[i + 5], typeList[i], -0.01);
}

const update = () => {
  const t1 = new Date().getTime();

  updateParticles(worldWidth, worldHeight);

  const t2 = new Date().getTime();
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  drawParticles(ctx);
  // const t3 = new Date().getTime();

  updateWorldSettings();

  // console.log(t2 - t1);

  requestAnimationFrame(update);
}

update();