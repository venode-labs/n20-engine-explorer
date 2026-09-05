export type PhotoId = "welt" | "bay";

export interface UvRect {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface PhotoHit {
  id: string;
  rect: UvRect;
  /** Higher draws later / sits closer for picking. */
  layer?: number;
  /**
   * Optical depth in this photograph (0 = recedes, 3 = nearest the camera).
   * Used only for relief parallax — not a measured engine dimension.
   */
  depth?: number;
}

export interface PhotoView {
  id: PhotoId;
  src: string;
  fullSrc: string;
  label: string;
  credit: string;
  license: string;
  sourcePage: string;
  /** Plane size in metres (approximate engine envelope). */
  width: number;
  height: number;
  hits: PhotoHit[];
}

/** Convert a UV rectangle (origin top-left) to a plane-local centre + size. */
export function uvRectToLocal(rect: UvRect, width: number, height: number) {
  const u = (rect.u0 + rect.u1) / 2;
  const v = (rect.v0 + rect.v1) / 2;
  return {
    x: (u - 0.5) * width,
    y: (0.5 - v) * height,
    w: Math.max(0.02, (rect.u1 - rect.u0) * width),
    h: Math.max(0.02, (rect.v1 - rect.v0) * height),
  };
}

export function cameraFromUv(
  view: PhotoView,
  uv: [number, number] = [0.5, 0.48],
  zoom = 1,
  fov = 32,
): { position: [number, number, number]; target: [number, number, number] } {
  const [u, v] = uv;
  const x = (u - 0.5) * view.width;
  const y = (0.5 - v) * view.height;
  const half = Math.max(view.width, view.height) / 2;
  const fit = half / Math.tan(((fov * Math.PI) / 180) / 2);
  const dist = (fit * 1.08) / zoom;
  return {
    position: [x, y, dist],
    target: [x, y, 0],
  };
}

/**
 * BMW Welt display N20 — Hullie, 30 Apr 2012, CC BY-SA 3.0.
 * UV origin top-left on the engine crop (`n20-welt.jpg`).
 * Depth is optical in this three-quarter view (exhaust/turbo nearer camera).
 */
const WELT_HITS: PhotoHit[] = [
  { id: "oil-cap", rect: { u0: 0.36, v0: 0.04, u1: 0.48, v1: 0.16 }, layer: 3, depth: 1 },
  { id: "dme", rect: { u0: 0.62, v0: 0.08, u1: 0.84, v1: 0.26 }, layer: 3, depth: 0 },
  { id: "vanos-intake", rect: { u0: 0.42, v0: 0.1, u1: 0.54, v1: 0.24 }, layer: 2, depth: 1 },
  { id: "vanos-exhaust", rect: { u0: 0.26, v0: 0.1, u1: 0.4, v1: 0.24 }, layer: 2, depth: 1 },
  { id: "valvetronic-motor", rect: { u0: 0.48, v0: 0.16, u1: 0.62, v1: 0.32 }, layer: 2, depth: 1 },
  { id: "map-thermostat", rect: { u0: 0.54, v0: 0.38, u1: 0.66, v1: 0.5 }, layer: 2, depth: 1 },
  { id: "crank-pulley", rect: { u0: 0.34, v0: 0.66, u1: 0.48, v1: 0.82 }, layer: 2, depth: 3 },
  { id: "belt-tensioner", rect: { u0: 0.2, v0: 0.48, u1: 0.34, v1: 0.64 }, layer: 2, depth: 3 },
  { id: "oil-cooler", rect: { u0: 0.7, v0: 0.28, u1: 0.86, v1: 0.46 }, layer: 2, depth: 0 },
  { id: "throttle-body", rect: { u0: 0.8, v0: 0.14, u1: 0.96, v1: 0.32 }, layer: 2, depth: 0 },
  { id: "electric-coolant-pump", rect: { u0: 0.64, v0: 0.48, u1: 0.8, v1: 0.64 }, layer: 2, depth: 1 },
  { id: "oil-filter-module", rect: { u0: 0.52, v0: 0.22, u1: 0.78, v1: 0.5 }, layer: 1, depth: 1 },
  { id: "alternator", rect: { u0: 0.5, v0: 0.44, u1: 0.72, v1: 0.62 }, layer: 1, depth: 2 },
  { id: "intake-manifold", rect: { u0: 0.68, v0: 0.2, u1: 0.94, v1: 0.46 }, layer: 1, depth: 0 },
  { id: "boost-pipe", rect: { u0: 0.06, v0: 0.36, u1: 0.28, v1: 0.54 }, layer: 1, depth: 3 },
  { id: "charge-pipe", rect: { u0: 0.2, v0: 0.42, u1: 0.52, v1: 0.58 }, layer: 1, depth: 2 },
  { id: "turbocharger", rect: { u0: 0.0, v0: 0.28, u1: 0.26, v1: 0.54 }, layer: 1, depth: 3 },
  { id: "exhaust-manifold", rect: { u0: 0.06, v0: 0.18, u1: 0.28, v1: 0.36 }, layer: 1, depth: 3 },
  { id: "serpentine-belt", rect: { u0: 0.3, v0: 0.54, u1: 0.54, v1: 0.76 }, layer: 1, depth: 3 },
  { id: "ac-compressor", rect: { u0: 0.4, v0: 0.7, u1: 0.56, v1: 0.9 }, layer: 1, depth: 3 },
  { id: "engine-cover", rect: { u0: 0.22, v0: 0.08, u1: 0.52, v1: 0.4 }, layer: 0, depth: 1 },
  { id: "cylinder-head", rect: { u0: 0.22, v0: 0.28, u1: 0.5, v1: 0.44 }, layer: 0, depth: 1 },
  { id: "crankcase", rect: { u0: 0.28, v0: 0.4, u1: 0.54, v1: 0.64 }, layer: 0, depth: 2 },
  { id: "oil-sump", rect: { u0: 0.22, v0: 0.62, u1: 0.58, v1: 0.9 }, layer: 0, depth: 2 },
];

const BAY_HITS: PhotoHit[] = [
  { id: "oil-filter-module", rect: { u0: 0.28, v0: 0.42, u1: 0.42, v1: 0.6 }, layer: 2, depth: 2 },
  { id: "intake-manifold", rect: { u0: 0.3, v0: 0.32, u1: 0.42, v1: 0.5 }, layer: 2, depth: 2 },
  { id: "charge-pipe", rect: { u0: 0.32, v0: 0.56, u1: 0.72, v1: 0.72 }, layer: 1, depth: 3 },
  { id: "airbox", rect: { u0: 0.08, v0: 0.28, u1: 0.32, v1: 0.62 }, layer: 1, depth: 2 },
  { id: "engine-cover", rect: { u0: 0.36, v0: 0.36, u1: 0.62, v1: 0.62 }, layer: 1, depth: 1 },
  { id: "intercooler", rect: { u0: 0.22, v0: 0.72, u1: 0.75, v1: 0.92 }, layer: 0, depth: 3 },
];

export const photoViews: Record<PhotoId, PhotoView> = {
  welt: {
    id: "welt",
    src: "/engine/photos/n20-welt.jpg",
    fullSrc: "/engine/photos/n20-welt-full.jpg",
    label: "BMW Welt display N20",
    credit: "Hullie (AHHM van Hulten), BMW Welt, 30 Apr 2012",
    license: "CC BY-SA 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:BMW_N20_Engine.JPG",
    width: 1.42,
    height: 1.42,
    hits: WELT_HITS,
  },
  bay: {
    id: "bay",
    src: "/engine/photos/f30-bay.jpg",
    fullSrc: "/engine/photos/f30-bay.jpg",
    label: "F30 328i engine bay",
    credit: "HLW, BMW 328i F30 2012 Motorraum",
    license: "CC BY-SA 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:BMW_328i_F30_2012_Motorraum_1.jpg",
    width: 1.8,
    height: 1.2,
    hits: BAY_HITS,
  },
};

export function hitsForPart(partId: string): { photo: PhotoId; hit: PhotoHit }[] {
  const out: { photo: PhotoId; hit: PhotoHit }[] = [];
  for (const view of Object.values(photoViews)) {
    const hit = view.hits.find((h) => h.id === partId);
    if (hit) out.push({ photo: view.id, hit });
  }
  return out;
}
