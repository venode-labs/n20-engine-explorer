import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

export function extrude(
  shape: THREE.Shape,
  depth: number,
  bevel = 0.004,
  curveSegments = 16,
): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

export function lathe(points: Array<[number, number]>, segs = 32): THREE.LatheGeometry {
  const g = new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segs,
  );
  g.computeVertexNormals();
  return g;
}

export function hose(
  pts: THREE.Vector3[],
  radius: number,
  tubular = 28,
  radial = 10,
  closed = false,
): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(pts, closed, "catmullrom", 0.35);
  const g = new THREE.TubeGeometry(curve, tubular, radius, radial, closed);
  g.computeVertexNormals();
  return g;
}

export function xf(g: THREE.BufferGeometry, fn: (m: THREE.Matrix4) => void): THREE.BufferGeometry {
  const c = g.clone();
  const m = new THREE.Matrix4();
  fn(m);
  c.applyMatrix4(m);
  return c;
}

export function placed(
  g: THREE.BufferGeometry,
  pos: [number, number, number],
  rot: [number, number, number] = [0, 0, 0],
): THREE.BufferGeometry {
  return xf(g, (m) => {
    m.makeRotationFromEuler(new THREE.Euler(rot[0], rot[1], rot[2]));
    m.setPosition(pos[0], pos[1], pos[2]);
  });
}

export function merge(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const prepared = geos.filter(Boolean).map((g) => (g.index ? g.toNonIndexed() : g));
  const g = mergeGeometries(prepared, false);
  if (!g) {
    return geos[0] ?? new THREE.BufferGeometry();
  }
  g.computeVertexNormals();
  return g;
}

export function pulley(r: number, w: number, groove = true): THREE.LatheGeometry {
  const pts: Array<[number, number]> = groove
    ? [
        [0.006, -w / 2],
        [r, -w / 2],
        [r - 0.005, -w / 6],
        [r + 0.001, 0],
        [r - 0.005, w / 6],
        [r, w / 2],
        [0.006, w / 2],
      ]
    : [
        [0.005, -w / 2],
        [r, -w / 2],
        [r, w / 2],
        [0.005, w / 2],
      ];
  return lathe(pts, 36);
}

export function hexBolt(scale = 1): THREE.BufferGeometry {
  const hex = new THREE.CylinderGeometry(0.0048 * scale, 0.0048 * scale, 0.0042 * scale, 6);
  const shank = new THREE.CylinderGeometry(0.0026 * scale, 0.0026 * scale, 0.01 * scale, 10);
  shank.translate(0, -0.006 * scale, 0);
  return merge([hex, shank]);
}

export function snail(
  rInner: number,
  rOuter: number,
  tubeR: number,
  turns = 1.65,
  segs = 48,
): THREE.TubeGeometry {
  const pts: THREE.Vector3[] = [];
  const n = segs;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * Math.PI * 2 * turns;
    const r = rOuter + (rInner - rOuter) * t * t;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  return hose(pts, tubeR, segs, 10, false);
}

export function disposeGeo(g: THREE.BufferGeometry | THREE.BufferGeometry[] | Record<string, THREE.BufferGeometry>) {
  const list = Array.isArray(g) ? g : g instanceof THREE.BufferGeometry ? [g] : Object.values(g);
  list.forEach((x) => x.dispose());
}
