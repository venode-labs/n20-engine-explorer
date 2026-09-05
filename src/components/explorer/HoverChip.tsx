import { componentById } from "@/data/components";
import { useExplorer } from "@/store/explorer";

export function HoverChip() {
  const hovered = useExplorer((s) => s.hoveredId);
  const selected = useExplorer((s) => s.selectedId);
  const part = hovered ? componentById[hovered] : null;
  if (!part || hovered === selected) return null;
  return (
    <div
      className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-md border border-border bg-surface/95 px-3 py-2 text-xs text-fg shadow-hud"
      role="status"
      aria-live="polite"
    >
      {part.canonicalName}
    </div>
  );
}
