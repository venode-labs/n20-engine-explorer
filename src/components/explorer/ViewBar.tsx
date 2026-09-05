import { Box, Camera, Columns2, Focus, RotateCcw, Scan } from "lucide-react";
import { photoViews } from "@/engine/photo-views";
import { cameraPresets, presetById } from "@/data/camera-presets";
import { cn } from "@/lib/cn";
import { useExplorer, type MaterialMode, type VisualMode } from "@/store/explorer";
import { chipBtn, iconBtn } from "./chrome";

const visuals: { id: VisualMode; label: string; Icon: typeof Camera }[] = [
  { id: "photo", label: "Photo", Icon: Camera },
  { id: "model", label: "3D", Icon: Box },
  { id: "xray", label: "X-ray", Icon: Scan },
];

const modes: { id: MaterialMode; label: string }[] = [
  { id: "normal", label: "Solid" },
  { id: "context", label: "Isolate" },
];

export function ViewBar() {
  const preset = useExplorer((s) => s.cameraPreset);
  const setPreset = useExplorer((s) => s.setPreset);
  const resetView = useExplorer((s) => s.resetView);
  const mode = useExplorer((s) => s.materialMode);
  const setMode = useExplorer((s) => s.setMaterialMode);
  const visual = useExplorer((s) => s.visualMode);
  const setVisual = useExplorer((s) => s.setVisualMode);
  const compare = useExplorer((s) => s.compareMode);
  const setCompare = useExplorer((s) => s.setCompareMode);
  const appView = useExplorer((s) => s.appView);
  const photo = photoViews[appView === "bay" || presetById[preset]?.photo === "bay" ? "bay" : "welt"];
  const schematic = visual !== "photo";

  const presets = cameraPresets.filter((p) => {
    if (schematic) return p.photo === "welt" || p.id === "hero";
    return appView === "bay" ? p.photo === "bay" : p.photo === "welt" || p.id === "bay";
  });

  return (
    <div className="hud-panel flex max-w-full items-center gap-1 overflow-hidden px-1.5 py-1">
      <div className="flex shrink-0 items-center rounded-md bg-elevated p-0.5">
        {visuals.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVisual(v.id)}
            className={cn(chipBtn, "gap-1.5 px-2.5 sm:px-3", visual === v.id && "bg-surface text-fg shadow-hud")}
            aria-pressed={visual === v.id}
          >
            <v.Icon className="size-3.5" strokeWidth={1.75} />
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      <div className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" />

      <div className="hud-scroll flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={cn(chipBtn, preset === p.id && "bg-elevated text-fg")}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" />

      <div className="flex shrink-0 items-center">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(chipBtn, "hidden sm:inline-flex", mode === m.id && "bg-elevated text-fg")}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMode(mode === "context" ? "normal" : "context")}
          className={cn(iconBtn, "sm:hidden", mode === "context" && "text-fg")}
          aria-label="Isolate"
          aria-pressed={mode === "context"}
        >
          <Focus className="size-4" strokeWidth={1.75} />
        </button>
        {!schematic && (
          <button
            type="button"
            onClick={() => setCompare(!compare)}
            className={cn(iconBtn, compare && "text-fg")}
            aria-label="Compare to source photograph"
            aria-pressed={compare}
            id="compare-source"
          >
            <Columns2 className="size-4" strokeWidth={1.75} />
          </button>
        )}
        <button type="button" onClick={resetView} className={iconBtn} aria-label="Reset view">
          <RotateCcw className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <p
        className="ml-1 hidden max-w-48 shrink-0 truncate pr-2 text-2xs text-subtle lg:block"
        title={schematic ? "Schematic reconstruction — not a photograph." : `${photo.credit}. ${photo.license}.`}
      >
        {schematic ? (visual === "xray" ? "X-ray schematic" : "3D schematic") : photo.license}
      </p>
    </div>
  );
}
