export interface ModelCam {
  position: [number, number, number];
  target: [number, number, number];
}

function cam(target: [number, number, number], dist: number, azDeg: number, elDeg: number): ModelCam {
  const az = (azDeg * Math.PI) / 180;
  const el = (elDeg * Math.PI) / 180;
  const x = target[0] + dist * Math.cos(el) * Math.sin(az);
  const y = target[1] + dist * Math.sin(el);
  const z = target[2] + dist * Math.cos(el) * Math.cos(az);
  return { position: [x, y, z], target };
}

export const MODEL_PRESETS: Record<string, ModelCam> = {
  hero: cam([0, 0.08, 0.02], 1.08, 34, 18),
  cover: cam([0, 0.34, 0], 0.72, 18, 58),
  ofh: cam([0.18, 0.15, 0.1], 0.58, 72, 22),
  intake: cam([0.16, 0.2, -0.02], 0.62, 92, 16),
  turbo: cam([-0.2, 0.09, 0], 0.58, -58, 16),
  front: cam([0.02, -0.02, 0.24], 0.72, 8, 10),
  bay: cam([0, 0.08, 0.02], 1.08, 34, 18),
};

export const MODEL_FOCUS: Record<string, ModelCam> = {
  "engine-cover": cam([0, 0.35, 0], 0.7, 20, 52),
  "oil-cap": cam([-0.02, 0.3, 0.2], 0.38, 15, 40),
  "oil-filter-module": cam([0.18, 0.15, 0.1], 0.5, 75, 22),
  "oil-cooler": cam([0.18, 0.14, 0.17], 0.42, 80, 18),
  dme: cam([0.18, 0.26, -0.04], 0.42, 85, 28),
  "intake-manifold": cam([0.17, 0.2, -0.02], 0.55, 95, 18),
  "throttle-body": cam([0.17, 0.2, -0.23], 0.42, 110, 12),
  "valvetronic-motor": cam([0.13, 0.25, 0.02], 0.4, 80, 18),
  "vanos-intake": cam([0.04, 0.25, 0.25], 0.38, 20, 18),
  "vanos-exhaust": cam([-0.04, 0.25, 0.25], 0.38, 10, 18),
  alternator: cam([0.18, 0.05, 0.23], 0.45, 40, 12),
  "electric-coolant-pump": cam([0.15, -0.02, 0.22], 0.42, 55, 8),
  "map-thermostat": cam([0.178, 0.11, 0.15], 0.38, 72, 14),
  "charge-pipe": cam([0.08, 0.08, 0.05], 0.7, 50, 12),
  "boost-pipe": cam([-0.12, 0.04, 0.18], 0.55, -20, 10),
  turbocharger: cam([-0.22, 0.09, 0], 0.52, -55, 16),
  "exhaust-manifold": cam([-0.19, 0.1, 0], 0.5, -70, 12),
  crankcase: cam([0, 0.02, 0], 0.85, 30, 8),
  "cylinder-head": cam([0, 0.19, 0], 0.7, 25, 18),
  "oil-sump": cam([0, -0.16, 0], 0.7, 20, -8),
  "serpentine-belt": cam([0.04, -0.02, 0.28], 0.55, 5, 8),
  "crank-pulley": cam([0, -0.08, 0.28], 0.42, 8, 4),
  "ac-compressor": cam([0.1, -0.15, 0.24], 0.45, 15, -6),
  "belt-tensioner": cam([-0.09, 0.01, 0.28], 0.4, -10, 6),
  hpfp: cam([0, 0.32, -0.22], 0.4, 160, 18),
  "fuel-rail": cam([0.1, 0.32, 0], 0.5, 80, 25),
  injectors: cam([0.1, 0.29, 0], 0.45, 85, 20),
  "ignition-coils": cam([0, 0.27, 0], 0.55, 15, 40),
  "valve-cover": cam([0, 0.27, 0], 0.55, 20, 35),
  wastegate: cam([-0.27, 0.13, -0.08], 0.38, -50, 18),
  "blow-off-valve": cam([-0.2, 0.15, 0.09], 0.35, -40, 16),
  "catalyst-interface": cam([-0.24, -0.04, -0.12], 0.45, -40, -6),
  "vacuum-pump": cam([-0.08, 0.25, -0.23], 0.4, 170, 12),
  "vacuum-reservoir": cam([0.09, 0.34, -0.04], 0.38, 70, 20),
};
