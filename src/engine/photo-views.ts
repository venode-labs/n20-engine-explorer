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
  /** Higher sits closer for picking when rectangles overlap. */
  layer?: number;
  /** Optical depth in this photograph, used only for relief parallax. */
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
  width: number;
  height: number;
  hits: PhotoHit[];
}

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
  const dist = (fit * 1.0) / zoom;
  return { position: [x, y, dist], target: [x, y, 0] };
}

/**
 * BMW Welt display N20 — Hullie, 30 Apr 2012, CC BY-SA 3.0.
 * UV origin top-left on n20-welt.jpg, 2489×2489.
 * Only hardware re-verified against per-hit crops is selectable here.
 */
const WELT_HITS: PhotoHit[] = [
  // VERIFIED 06/09/2026 against the 2489×2489 Hullie crop. Keep this list conservative.
  { id: "engine-cover", rect: { u0: 0.0157, v0: 0.0165, u1: 0.6436, v1: 0.4134 }, layer: 0, depth: 1 },
  { id: "oil-cap", rect: { u0: 0.0346, v0: 0.1499, u1: 0.1551, v1: 0.2451 }, layer: 4, depth: 2 },
  { id: "oil-filter-module", rect: { u0: 0.6557, v0: 0.0611, u1: 0.8236, v1: 0.1450 }, layer: 3, depth: 1 },
  { id: "oil-cooler", rect: { u0: 0.6448, v0: 0.1462, u1: 0.9237, v1: 0.3491 }, layer: 3, depth: 2 },
  { id: "alternator", rect: { u0: 0.6766, v0: 0.3499, u1: 0.9036, v1: 0.5235 }, layer: 2, depth: 2 },
  { id: "serpentine-belt", rect: { u0: 0.7256, v0: 0.4564, u1: 0.7935, v1: 0.5235 }, layer: 4, depth: 3 },
  { id: "ac-compressor", rect: { u0: 0.7613, v0: 0.5163, u1: 0.9534, v1: 0.7336 }, layer: 2, depth: 3 },
  { id: "crank-pulley", rect: { u0: 0.4456, v0: 0.6613, u1: 0.7236, v1: 0.8734 }, layer: 3, depth: 3 },
  { id: "electric-coolant-pump", rect: { u0: 0.2857, v0: 0.7814, u1: 0.4737, v1: 0.9534 }, layer: 2, depth: 3 },
  { id: "turbocharger", rect: { u0: 0.0346, v0: 0.4500, u1: 0.3005, v1: 0.7151 }, layer: 2, depth: 3 },
  { id: "boost-pipe", rect: { u0: 0.0960, v0: 0.6163, u1: 0.2037, v1: 0.7087 }, layer: 4, depth: 3 },
];

/**
 * F30 328i engine bay — HLW, CC BY-SA 3.0.
 * UV origin top-left on f30-bay.jpg, 2560×1706.
 * This reference plate is not represented as the Australian F32 itself.
 */
const BAY_HITS: PhotoHit[] = [
  // VERIFIED 06/09/2026 against the 2560×1706 F30 bay plate. No hidden/occluded hardware is marked.
  { id: "engine-cover", rect: { u0: 0.230, v0: 0.080, u1: 0.660, v1: 0.545 }, layer: 0, depth: 1 },
  { id: "oil-cap", rect: { u0: 0.238, v0: 0.355, u1: 0.302, v1: 0.455 }, layer: 4, depth: 2 },
  { id: "oil-filter-module", rect: { u0: 0.505, v0: 0.345, u1: 0.607, v1: 0.465 }, layer: 3, depth: 2 },
  { id: "oil-cooler", rect: { u0: 0.500, v0: 0.440, u1: 0.635, v1: 0.565 }, layer: 3, depth: 2 },
  { id: "charge-pipe", rect: { u0: 0.635, v0: 0.285, u1: 0.700, v1: 0.580 }, layer: 3, depth: 2 },
  { id: "airbox", rect: { u0: 0.185, v0: 0.570, u1: 0.785, v1: 0.845 }, layer: 1, depth: 2 },
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
