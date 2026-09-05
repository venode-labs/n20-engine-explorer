import { useEffect, useRef } from "react";
import { vehicle } from "@/data/vehicle";
import { useExplorer } from "@/store/explorer";

export function VinPanel() {
  const open = useExplorer((s) => s.vinOpen);
  const setOpen = useExplorer((s) => s.setVinOpen);
  const draft = useExplorer((s) => s.vinDraft);
  const setDraft = useExplorer((s) => s.setVinDraft);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vin-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close VIN panel"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-hud">
        <h2 id="vin-title" className="text-sm font-medium text-fg">
          Vehicle identification
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Vehicle configuration: {vehicle.configurationLabel}
        </p>
        <label className="mt-4 block text-2xs uppercase tracking-wide text-muted" htmlFor="vin-input">
          VIN
        </label>
        <input
          ref={inputRef}
          id="vin-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          maxLength={17}
          className="mt-1 h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm tracking-widest text-fg"
          placeholder="WBAXXXXXXXXXXXXXX"
          autoComplete="off"
        />
        <p className="mt-3 text-sm text-warn">VIN lookup not connected in this prototype.</p>
        <p className="mt-2 text-2xs leading-relaxed text-subtle">
          No VIN is decoded locally and no BMW database is queried. Exact engine suffix, ECU, transmission and
          emissions package remain unmarked until a verified service is integrated.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="h-11 rounded-md border border-border px-4 text-xs tracking-wide text-fg hover:bg-elevated active:scale-[0.96] motion-safe:transition-[transform,background-color] motion-safe:duration-150"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
