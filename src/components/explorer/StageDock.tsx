import { Columns2, Focus, RotateCcw } from "lucide-react";
import { cameraPresets } from "@/data/camera-presets";
import { cn } from "@/lib/cn";
import { useExplorer } from "@/store/explorer";
import { chipBtn, iconBtn } from "./chrome";

export function StageDock() {
  const preset = useExplorer((s) => s.cameraPreset);
  const setPreset = useExplorer((s) => s.setPreset);
  const resetView = useExplorer((s) => s.resetView);
  const mode = useExplorer((s) => s.materialMode);
  const setMode = useExplorer((s) => s.setMaterialMode);
  const visual = useExplorer((s) => s.visualMode);
  const compare = useExplorer((s) => s.compareMode);
  const setCompare = useExplorer((s) => s.setCompareMode);
  const explode = useExplorer((s) => s.explode);
  const setExplode = useExplorer((s) => s.setExplode);
  const appView = useExplorer((s) => s.appView);
  const schematic = visual !== "photo";

  const presets = cameraPresets.filter((p) => {
    if (schematic) return p.photo === "welt" || p.id === "hero";
    return appView === "bay" ? p.photo === "bay" : p.photo === "welt" || p.id === "bay";
  });

  return (
    <div className="hud-panel flex max-w-full flex-col overflow-hidden rounded-[6px] p-1 sm:flex-row sm:items-center">
      <div className="hud-scroll hud-scroll-edge flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overscroll-x-contain pr-5">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={cn(chipBtn, preset === p.id && "bg-elevated text-fg")}
            aria-pressed={preset === p.id}
            title={`${p.label} camera preset`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {schematic ? (
        <div className="flex h-11 min-w-0 items-center gap-2 border-t border-border px-2 sm:h-9 sm:w-44 sm:border-t-0 sm:border-l">
          <span className="text-[10px] uppercase tracking-[0.12em] text-subtle sm:text-[9px]">Explode</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(explode * 100)}
            onChange={(e) => setExplode(Number(e.target.value) / 100)}
            className="range-explode min-w-16 flex-1"
            aria-label="Exploded view"
          />
          <span className="w-7 text-right font-mono text-[10px] tabular-nums text-muted sm:w-6 sm:text-[9px]">{Math.round(explode * 100)}</span>
        </div>
      ) : null}

      <div className="flex shrink-0 items-center justify-end gap-0.5 border-t border-border sm:border-t-0 sm:border-l sm:pl-1">
        <button
          type="button"
          onClick={() => setMode(mode === "context" ? "normal" : "context")}
          className={cn(chipBtn, "gap-1.5", mode === "context" && "bg-elevated text-fg")}
          aria-pressed={mode === "context"}
        >
          <Focus className="size-3.5" strokeWidth={1.6} />
          <span>Isolate</span>
        </button>
        {!schematic && (
          <button
            type="button"
            onClick={() => setCompare(!compare)}
            className={cn(chipBtn, "gap-1.5", compare && "bg-elevated text-fg")}
            aria-label="Compare to source photograph"
            aria-pressed={compare}
            id="compare-source"
          >
            <Columns2 className="size-3.5" strokeWidth={1.6} />
            <span>Compare</span>
          </button>
        )}
        <button type="button" onClick={resetView} className={iconBtn} aria-label="Reset view" title="Reset view">
          <RotateCcw className="size-3.5" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
