import { componentById } from "@/data/components";
import { systemById } from "@/data/systems";
import { useExplorer } from "@/store/explorer";

export function StageReadout() {
  const hovered = useExplorer((s) => s.hoveredId);
  const selected = useExplorer((s) => s.selectedId);
  const id = hovered ?? selected;
  const part = id ? componentById[id] : null;
  if (!part) return null;
  const sys = systemById[part.system];

  return (
    <div className="pointer-events-none mt-1.5 border-l border-accent bg-bg/78 px-2.5 py-1.5 text-center backdrop-blur-md" role="status" aria-live="polite">
      <p className="text-[11px] font-medium text-fg">{part.canonicalName}</p>
      <p className="mt-0.5 text-[9px] uppercase tracking-[0.13em] text-subtle">
        {sys?.index} · {sys?.label ?? part.system}{hovered && hovered !== selected ? " · hover" : ""}
      </p>
    </div>
  );
}
