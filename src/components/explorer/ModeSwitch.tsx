import { Box, Camera, Scan } from "lucide-react";
import { cn } from "@/lib/cn";
import { useExplorer, type VisualMode } from "@/store/explorer";

const visuals: { id: VisualMode; label: string; hint: string; Icon: typeof Camera }[] = [
  { id: "photo", label: "Photo", hint: "Real photographed engine", Icon: Camera },
  { id: "model", label: "3D", hint: "Schematic reconstruction", Icon: Box },
  { id: "xray", label: "X-ray", hint: "Translucent schematic", Icon: Scan },
];

export function ModeSwitch() {
  const visual = useExplorer((s) => s.visualMode);
  const setVisual = useExplorer((s) => s.setVisualMode);

  return (
    <div className="hud-panel flex items-center gap-0.5 rounded-[5px] p-1" role="group" aria-label="Engine view">
      {visuals.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setVisual(v.id)}
          className={cn(
            "inline-flex h-11 min-w-[4.25rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] px-2.5 text-[12px] tracking-[0.035em] text-muted sm:h-8 sm:min-w-0 sm:px-3 sm:text-[11px] sm:tracking-[0.04em]",
            "transition-[color,background-color,box-shadow] duration-150 hover:text-fg",
            visual === v.id && "bg-elevated text-fg shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.04)]",
          )}
          aria-label={`${v.label}: ${v.hint}`}
          aria-pressed={visual === v.id}
          title={v.hint}
        >
          <v.Icon className="size-3.5 shrink-0" strokeWidth={1.6} />
          <span>{v.label}</span>
        </button>
      ))}
    </div>
  );
}
