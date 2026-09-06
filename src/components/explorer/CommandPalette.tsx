import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { searchComponentsRich } from "@/data/search";
import { systemById } from "@/data/systems";
import { useExplorer } from "@/store/explorer";
import { cn } from "@/lib/cn";

export function CommandPalette() {
  const open = useExplorer((s) => s.paletteOpen);
  const setOpen = useExplorer((s) => s.setPaletteOpen);
  const select = useExplorer((s) => s.select);
  const setAppView = useExplorer((s) => s.setAppView);
  const query = useExplorer((s) => s.query);
  const setQuery = useExplorer((s) => s.setQuery);
  const [local, setLocal] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLocal(query);
      setActive(0);
    }
  }, [open, query]);

  const list = useMemo(() => searchComponentsRich(local).slice(0, 12), [local]);

  useEffect(() => {
    setActive(0);
  }, [local]);

  const pick = (id: string) => {
    const part = list.find((c) => c.id === id) ?? searchComponentsRich(id)[0];
    select(id);
    setQuery(local);
    setAppView(part?.bayOnly ? "bay" : "engine");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/78 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-[6px] border border-border bg-surface shadow-hud outline-none"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Search parts</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search engine components, systems and associated symptoms. Use the arrow keys to move and Enter to open a result.
          </Dialog.Description>
          <div className="relative border-b border-border">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" strokeWidth={1.75} />
            <input
              ref={inputRef}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((i) => Math.min(Math.max(0, list.length - 1), i + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter" && list[active]) {
                  e.preventDefault();
                  pick(list[active].id);
                }
              }}
              placeholder="Search parts, systems, symptoms…"
              className="h-14 w-full bg-transparent pr-4 pl-12 text-sm text-fg placeholder:text-subtle outline-none"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls="viscerra-search-results"
              aria-activedescendant={list[active] ? `search-result-${list[active].id}` : undefined}
            />
          </div>
          <ul id="viscerra-search-results" role="listbox" className="max-h-80 overflow-y-auto py-1">
            {list.map((c, i) => (
              <li key={c.id} id={`search-result-${c.id}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(c.id)}
                  className={cn(
                    "flex min-h-11 w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left",
                    i === active ? "bg-elevated" : "",
                  )}
                >
                  <span className="text-sm text-fg">{c.canonicalName}</span>
                  <span className="kicker">{systemById[c.system]?.short}</span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="px-4 py-6 text-sm text-muted">No match.</li>}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
