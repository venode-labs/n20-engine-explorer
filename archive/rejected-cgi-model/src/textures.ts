import * as THREE from "three";

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context");
  return [c, ctx];
}

function toTexture(c: HTMLCanvasElement, repeat = 4): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Sand-cast aluminium albedo. */
export function makeCastAlbedo(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = hash(x * 19.1 + y * 7.3);
      const n2 = hash(x * 3.7 + y * 41.2);
      const pit = n > 0.94 ? -40 : n > 0.88 ? -18 : 0;
      const grain = 18 * n2;
      img.data[i] = 168 + grain + pit;
      img.data[i + 1] = 164 + grain * 0.9 + pit;
      img.data[i + 2] = 154 + grain * 0.7 + pit;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, 6);
}

/** Machined aluminium with circumferential brushing. */
export function makeMachinedAlbedo(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const ring = Math.sin((x / size) * Math.PI * 42) * 8;
      const n = hash(y * 0.7 + x * 0.02) * 10;
      img.data[i] = 198 + ring + n;
      img.data[i + 1] = 202 + ring + n;
      img.data[i + 2] = 206 + ring * 0.8 + n;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, 2);
}

/** Heat-discoloured turbo / exhaust steel. */
export function makeHeatAlbedo(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const g = ctx.createLinearGradient(0, 0, size, size * 0.4);
  g.addColorStop(0, "#3a3532");
  g.addColorStop(0.18, "#6a5040");
  g.addColorStop(0.38, "#b07a48");
  g.addColorStop(0.55, "#c4a878");
  g.addColorStop(0.72, "#6a7a88");
  g.addColorStop(0.88, "#4a545c");
  g.addColorStop(1, "#2e3236");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (hash(i * 0.17) - 0.5) * 16;
    img.data[i] = Math.min(255, Math.max(0, img.data[i] + n));
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n * 0.8));
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n * 0.6));
  }
  ctx.putImageData(img, 0, 0);
  const tex = toTexture(c, 1);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Black engine-cover plastic with orange-peel. */
export function makePlasticAlbedo(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const peel = Math.sin(x * 0.9) * Math.cos(y * 0.85) * 6;
      const n = hash(x * 5.1 + y * 9.2) * 8;
      const v = 22 + peel + n;
      img.data[i] = v;
      img.data[i + 1] = v + 1;
      img.data[i + 2] = v + 2;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, 3);
}

/** Roughness companion from an albedo (darker = rougher pits). */
export function makeRoughnessFrom(albedo: THREE.CanvasTexture, base = 0.48, amp = 0.22): THREE.CanvasTexture {
  const src = albedo.image as HTMLCanvasElement;
  const [c, ctx] = canvas(src.width);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, src.width, src.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const lum = (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3 / 255;
    const r = Math.round((base + (1 - lum) * amp) * 255);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = r;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.copy(albedo.repeat);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Cheap tangent-space normal from albedo luminance. */
export function makeNormalFrom(albedo: THREE.CanvasTexture, strength = 1.4): THREE.CanvasTexture {
  const src = albedo.image as HTMLCanvasElement;
  const w = src.width;
  const [c, ctx] = canvas(w);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, w, w);
  const out = ctx.createImageData(w, w);
  const lum = (x: number, y: number) => {
    const xx = ((x % w) + w) % w;
    const yy = ((y % w) + w) % w;
    const i = (yy * w + xx) * 4;
    return img.data[i] / 255;
  };
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (lum(x + 1, y) - lum(x - 1, y)) * strength;
      const dy = (lum(x, y + 1) - lum(x, y - 1)) * strength;
      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      const i = (y * w + x) * 4;
      out.data[i] = Math.round((nx / len) * 0.5 * 255 + 128);
      out.data[i + 1] = Math.round((ny / len) * 0.5 * 255 + 128);
      out.data[i + 2] = Math.round((nz / len) * 0.5 * 255 + 128);
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.copy(albedo.repeat);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function makeBeltAlbedo(size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#1a1614";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#12100e";
  for (let x = 0; x < size; x += 6) {
    ctx.fillRect(x, 0, 3, size);
  }
  return toTexture(c, 8);
}
