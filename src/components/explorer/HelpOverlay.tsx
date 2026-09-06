import * as Dialog from "@radix-ui/react-dialog";
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/78 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[6px] border border-border bg-surface p-5 shadow-hud outline-none">
          <p className="kicker">Shortcuts</p>
          <Dialog.Title className="mt-1 text-base font-medium text-fg">How to inspect</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
            Drag to inspect or orbit. Pinch or scroll to zoom. Photo is the source view; 3D and X-ray are schematics.
          </Dialog.Description>
          <dl className="mt-4 divide-y divide-border">
            {ROWS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="font-mono text-xs tracking-wide text-accent">{k}</dt>
                <dd className="text-right text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="h-11 rounded-[4px] border border-border px-4 text-xs tracking-wide text-fg hover:bg-elevated"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
