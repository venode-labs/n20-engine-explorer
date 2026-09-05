import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchComponents } from "@/data/components";
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
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, query]);

  const list = useMemo(() => searchComponents(local).slice(0, 12), [local]);

  useEffect(() => {
    setActive(0);
  }, [local]);

  if (!open) return null;

  const pick = (id: string) => {
    const part = list.find((c) => c.id === id) ?? searchComponents(id)[0];
    select(id);
    setQuery(local);
    setAppView(part?.bayOnly ? "bay" : "engine");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search parts">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close search" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[6px] border border-border bg-surface shadow-hud">
        <div className="relative border-b border-border">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(list.length - 1, i + 1));
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
          />
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {list.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(c.id)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left",
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
      </div>
    </div>
  );
}
