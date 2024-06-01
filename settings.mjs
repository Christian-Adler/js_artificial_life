export const Settings = {
  particlesPerGroup: 200,
  wrapWorld: true,
  particleSize: 3,
  maxV: 10,
  velocityFactor: 0.1, // 0.002,
  repulsionDistance: 10,
  maxInterferenceDistance: 100,
  fullForceDistance: 45,
};

Settings.fullForceDistance = (Settings.maxInterferenceDistance - Settings.repulsionDistance) / 2;

const urlParams = new URLSearchParams(window.location.search);
try {
  const v = parseInt(urlParams.get("n"));
  if (!isNaN(v))
    Settings.particlesPerGroup = v;
} catch (e) {
}

