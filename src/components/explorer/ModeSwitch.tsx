import { Box, Camera, Scan } from "lucide-react";
import { cn } from "@/lib/cn";
import { useExplorer, type VisualMode } from "@/store/explorer";

const visuals: { id: VisualMode; label: string; hint: string; Icon: typeof Camera }[] = [
  { id: "photo", label: "Photo", hint: "Real photographed engine — visual source of truth", Icon: Camera },
  { id: "model", label: "3D", hint: "Interactive schematic reconstruction — not photorealistic", Icon: Box },
  { id: "xray", label: "X-ray", hint: "Translucent schematic view — not photorealistic", Icon: Scan },
];

export function ModeSwitch() {
  const visual = useExplorer((s) => s.visualMode);
  const setVisual = useExplorer((s) => s.setVisualMode);

  return (
    <div className="hud-panel flex items-center gap-0.5 rounded-[5px] p-1" role="group" aria-label="Engine visual mode">
      {visuals.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setVisual(v.id)}
          className={cn(
            "inline-flex h-11 min-w-[3.875rem] items-center justify-center gap-1 whitespace-nowrap rounded-[3px] px-2 text-[12px] font-medium tracking-[0.025em] text-muted sm:h-9 sm:min-w-0 sm:gap-1.5 sm:px-3 sm:text-[12px] sm:tracking-[0.035em]",
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
