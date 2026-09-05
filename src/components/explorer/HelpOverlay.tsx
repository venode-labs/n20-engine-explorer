import { useExplorer } from "@/store/explorer";

const ROWS: [string, string][] = [
  ["1 / 2 / 3", "Photo, 3D, X-ray"],
  ["/ or ⌘K", "Search catalogue"],
  ["↑ ↓", "Step through parts"],
  ["Esc", "Clear selection"],
  ["I", "Isolate selected part"],
  ["E", "Cycle explode"],
  ["C", "Compare source photo"],
  ["R", "Reset camera"],
  ["?", "This panel"],
];

export function HelpOverlay() {
  const open = useExplorer((s) => s.helpOpen);
  const setOpen = useExplorer((s) => s.setHelpOpen);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close shortcuts" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-[6px] border border-border bg-surface p-5 shadow-hud">
        <p className="kicker">Shortcuts</p>
        <h2 id="help-title" className="mt-1 text-base font-medium text-fg">
          How to look
        </h2>
        <p className="mt-2 text-sm text-muted">Drag to orbit. Scroll to zoom. Click a part. The photograph is the visual truth; 3D and X-ray are schematics.</p>
        <dl className="mt-4 divide-y divide-border">
          {ROWS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="font-mono text-xs tracking-wide text-accent">{k}</dt>
              <dd className="text-sm text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="h-10 rounded-[4px] border border-border px-4 text-xs tracking-wide text-fg hover:bg-elevated"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
