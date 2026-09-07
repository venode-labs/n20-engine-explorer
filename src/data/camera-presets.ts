import { cameraFromUv, photoViews, type PhotoId, type PhotoView } from "@/engine/photo-views";

export interface CameraPreset {
  id: string;
  label: string;
  photo: PhotoId;
  uv: [number, number];
  zoom: number;
  position: [number, number, number];
  target: [number, number, number];
}

export interface PhotoFocus {
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

function focusMap(view: PhotoView): Record<string, PhotoFocus> {
  return Object.fromEntries(
    view.hits.map((hit) => {
      const uv: [number, number] = [(hit.rect.u0 + hit.rect.u1) / 2, (hit.rect.v0 + hit.rect.v1) / 2];
      const extent = Math.max(hit.rect.u1 - hit.rect.u0, hit.rect.v1 - hit.rect.v0);
      const zoom = Math.min(3.2, Math.max(1.6, 0.7 / Math.max(0.05, extent)));
      const cam = cameraFromUv(view, uv, zoom);
      return [hit.id, { photo: view.id, uv, zoom, ...cam }];
    }),
  );
}

export const cameraPresets: CameraPreset[] = [
  preset("hero", "Hero", "welt", [0.53, 0.47], 1.58),
  preset("cover", "Cover", "welt", [0.33, 0.23], 1.8),
  preset("ofh", "Oil filter", "welt", [0.74, 0.10], 2.7),
  preset("turbo", "Turbo / exhaust", "welt", [0.17, 0.58], 2.35),
  preset("front", "Accessory drive", "welt", [0.68, 0.56], 2.0),
  preset("bay", "In-bay", "bay", [0.50, 0.46], 1.92),
];

export const presetById = Object.fromEntries(cameraPresets.map((entry) => [entry.id, entry]));

/**
 * Every photograph owns its own focus map. Duplicate components (for example
 * engine-cover and oil-cap) must use coordinates calibrated for the photograph
 * currently on screen rather than coordinates from another physical engine.
 */
export const PHOTO_FOCUS: Record<PhotoId, Record<string, PhotoFocus>> = {
  welt: focusMap(photoViews.welt),
  bay: focusMap(photoViews.bay),
};

export function photoFocus(photo: PhotoId, partId: string): PhotoFocus | undefined {
  return PHOTO_FOCUS[photo][partId];
}

/**
 * Preferred-photo lookup used only to choose which verified photograph to open
 * when a component appears on more than one plate. The higher-resolution Welt
 * plate remains preferred for duplicate components; camera focusing itself must
 * use `photoFocus(activePhoto, partId)`.
 */
export const PART_FOCUS: Record<string, PhotoFocus> = {
  ...PHOTO_FOCUS.bay,
  ...PHOTO_FOCUS.welt,
};
