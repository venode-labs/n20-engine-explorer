import { Search, X } from "lucide-react";
import { components, searchComponents } from "@/data/components";
import { engineSystems } from "@/data/systems";
import { useExplorer } from "@/store/explorer";
import { cn } from "@/lib/cn";
import { panelShell } from "./chrome";

export function PartsNav({ onPick, plain }: { onPick?: () => void; plain?: boolean }) {
  const query = useExplorer((s) => s.query);
  const setQuery = useExplorer((s) => s.setQuery);
  const system = useExplorer((s) => s.systemFilter);
  const setSystem = useExplorer((s) => s.setSystem);
  const selected = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const appView = useExplorer((s) => s.appView);
  const searchId = plain ? "part-search-mobile" : "part-search";

  const list = searchComponents(query).filter((c) => {
    if (c.bayOnly && appView !== "bay") return false;
    if (system !== "all" && c.system !== system) return false;
    return true;
  });

  const modelled = components.filter((c) => !c.bayOnly).length;

  return (
    <aside className={plain ? "flex h-full min-h-0 flex-col overflow-hidden bg-surface" : panelShell}>
      <div className="border-b border-border p-2">
        <label className="sr-only" htmlFor={searchId}>
          Search parts
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-subtle" strokeWidth={1.75} />
          <input
            id={searchId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search turbo, HPFP, coils…"
            className="h-11 w-full rounded-md border border-border bg-bg pr-11 pl-9 text-sm text-fg placeholder:text-subtle"
            suppressHydrationWarning
          />
          {query ? (
            <button
              type="button"
              className="absolute top-0 right-0 inline-flex size-11 items-center justify-center text-muted hover:text-fg"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="size-3.5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="hud-scroll flex gap-1 overflow-x-auto border-b border-border px-2 py-1">
        {engineSystems.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSystem(s.id)}
            className={cn(
              "h-11 shrink-0 rounded-md px-3 text-2xs tracking-wide",
              "motion-safe:transition-[color,background-color] motion-safe:duration-150",
              system === s.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto py-1" aria-label="Engine components">
        {list.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => {
                select(c.id);
                onPick?.();
              }}
              className={cn(
                "flex min-h-11 w-full flex-col items-start gap-0.5 border-l-2 px-3 py-2.5 text-left",
                "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
                selected === c.id
                  ? "border-accent bg-elevated text-fg"
                  : "border-transparent text-muted hover:bg-elevated/60 hover:text-fg",
              )}
            >
              <span className="text-sm text-fg">{c.canonicalName}</span>
              <span className="text-2xs uppercase tracking-wide text-subtle">{c.system}</span>
            </button>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-3 py-6 text-sm text-muted">No parts match that search.</li>
        )}
      </ul>
      <p className="border-t border-border px-3 py-2 text-2xs text-subtle">{modelled} catalogue components</p>
    </aside>
  );
}
