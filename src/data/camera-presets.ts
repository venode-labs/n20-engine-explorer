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

function preset(id: string, label: string, photo: PhotoId, uv: [number, number], zoom: number): CameraPreset {
  const cam = cameraFromUv(photoViews[photo], uv, zoom);
  return { id, label, photo, uv, zoom, ...cam };
}

export const cameraPresets: CameraPreset[] = [
  preset("hero", "Hero", "welt", [0.53, 0.47], 1.58),
  preset("cover", "Cover", "welt", [0.33, 0.23], 1.8),
  preset("ofh", "Oil filter", "welt", [0.74, 0.10], 2.7),
  preset("turbo", "Turbo / exhaust", "welt", [0.17, 0.58], 2.35),
  preset("front", "Accessory drive", "welt", [0.68, 0.56], 2.0),
  preset("bay", "In-bay", "bay", [0.50, 0.46], 1.92),
];

export const presetById = Object.fromEntries(cameraPresets.map((p) => [p.id, p]));

/**
 * Photo focus exists only for calibrated photo hits. Bay is evaluated first so
 * duplicate parts prefer the higher-resolution Welt calibration where available.
 */
export const PART_FOCUS: Record<
  string,
  { photo: PhotoId; uv: [number, number]; zoom: number; position: [number, number, number]; target: [number, number, number] }
> = Object.fromEntries(
  [photoViews.bay, photoViews.welt].flatMap((view) =>
    view.hits.map((hit) => {
      const uv: [number, number] = [(hit.rect.u0 + hit.rect.u1) / 2, (hit.rect.v0 + hit.rect.v1) / 2];
      const extent = Math.max(hit.rect.u1 - hit.rect.u0, hit.rect.v1 - hit.rect.v0);
      const zoom = Math.min(3.2, Math.max(1.6, 0.7 / Math.max(0.05, extent)));
      const cam = cameraFromUv(view, uv, zoom);
      return [hit.id, { photo: view.id, uv, zoom, ...cam }];
    }),
  ),
);
