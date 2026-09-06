import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { vehicle } from "@/data/vehicle";
import { useExplorer } from "@/store/explorer";

export function VinPanel() {
  const open = useExplorer((s) => s.vinOpen);
  const setOpen = useExplorer((s) => s.setVinOpen);
  const draft = useExplorer((s) => s.vinDraft);
  const setDraft = useExplorer((s) => s.setVinDraft);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/78 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed right-4 bottom-4 left-4 z-50 mx-auto w-auto max-w-md rounded-[6px] border border-border bg-surface p-5 shadow-hud outline-none sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <Dialog.Title className="text-sm font-medium text-fg">Vehicle identification</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
            Vehicle configuration: {vehicle.configurationLabel}
          </Dialog.Description>
          <label className="mt-4 block text-2xs uppercase tracking-wide text-muted" htmlFor="vin-input">
            VIN reference — not sent
          </label>
          <input
            ref={inputRef}
            id="vin-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ""))}
            maxLength={17}
            inputMode="text"
            className="mt-1 h-11 w-full rounded-[4px] border border-border bg-bg px-3 font-mono text-sm tracking-widest text-fg"
            placeholder="WBAXXXXXXXXXXXXXX"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="mt-3 text-sm text-warn">VIN verification is not connected.</p>
          <p className="mt-2 text-2xs leading-relaxed text-subtle">
            The value stays in this session. No VIN is decoded locally and no BMW database is queried. Exact engine
            suffix, ECU, transmission and emissions package remain unverified until a trusted service is integrated.
          </p>
          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="h-11 rounded-[4px] border border-border px-4 text-xs tracking-wide text-fg hover:bg-elevated active:scale-[0.96] motion-safe:transition-[transform,background-color] motion-safe:duration-150"
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
