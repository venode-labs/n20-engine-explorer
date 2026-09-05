import { cameraFromUv, photoViews, type PhotoId } from "@/engine/photo-views";

export interface CameraPreset {
  id: string;
  label: string;
  photo: PhotoId;
  uv: [number, number];
  zoom: number;
  position: [number, number, number];
  target: [number, number, number];
}

function preset(
  id: string,
  label: string,
  photo: PhotoId,
  uv: [number, number],
  zoom: number,
): CameraPreset {
  const cam = cameraFromUv(photoViews[photo], uv, zoom);
  return { id, label, photo, uv, zoom, ...cam };
}

export const cameraPresets: CameraPreset[] = [
  preset("hero", "Hero", "welt", [0.5, 0.5], 0.86),
  preset("cover", "Cover", "welt", [0.38, 0.24], 1.85),
  preset("ofh", "Oil filter", "welt", [0.64, 0.36], 2.05),
  preset("intake", "Intake side", "welt", [0.78, 0.32], 1.9),
  preset("turbo", "Turbo / exhaust", "welt", [0.14, 0.4], 2.05),
  preset("front", "Accessory drive", "welt", [0.42, 0.68], 1.9),
  preset("bay", "In-bay", "bay", [0.48, 0.52], 1.22),
];

export const presetById = Object.fromEntries(cameraPresets.map((p) => [p.id, p]));

export const PART_FOCUS: Record<
  string,
  { photo: PhotoId; uv: [number, number]; zoom: number; position: [number, number, number]; target: [number, number, number] }
> = Object.fromEntries(
  (
    [
      ["engine-cover", "welt", [0.38, 0.24], 1.9],
      ["oil-cap", "welt", [0.42, 0.1], 3.1],
      ["oil-filter-module", "welt", [0.64, 0.36], 2.3],
      ["oil-cooler", "welt", [0.78, 0.36], 2.6],
      ["dme", "welt", [0.72, 0.16], 2.6],
      ["intake-manifold", "welt", [0.8, 0.32], 2.2],
      ["throttle-body", "welt", [0.88, 0.22], 2.8],
      ["valvetronic-motor", "welt", [0.55, 0.24], 2.8],
      ["vanos-intake", "welt", [0.48, 0.16], 2.9],
      ["vanos-exhaust", "welt", [0.33, 0.16], 2.9],
      ["alternator", "welt", [0.6, 0.52], 2.5],
      ["electric-coolant-pump", "welt", [0.72, 0.56], 2.7],
      ["map-thermostat", "welt", [0.6, 0.44], 3],
      ["charge-pipe", "welt", [0.36, 0.5], 2.3],
      ["boost-pipe", "welt", [0.16, 0.45], 2.5],
      ["turbocharger", "welt", [0.13, 0.4], 2.4],
      ["exhaust-manifold", "welt", [0.16, 0.28], 2.6],
      ["crankcase", "welt", [0.4, 0.52], 2.1],
      ["cylinder-head", "welt", [0.36, 0.36], 2.2],
      ["oil-sump", "welt", [0.4, 0.76], 2.2],
      ["serpentine-belt", "welt", [0.42, 0.64], 2.3],
      ["crank-pulley", "welt", [0.41, 0.74], 2.8],
      ["ac-compressor", "welt", [0.48, 0.8], 2.6],
      ["belt-tensioner", "welt", [0.27, 0.56], 2.8],
      ["airbox", "bay", [0.2, 0.45], 1.8],
      ["intercooler", "bay", [0.48, 0.82], 1.7],
    ] as const
  ).map(([id, photo, uv, zoom]) => {
    const uv2: [number, number] = [uv[0], uv[1]];
    const cam = cameraFromUv(photoViews[photo], uv2, zoom);
    return [id, { photo, uv: uv2, zoom, ...cam }];
  }),
);
