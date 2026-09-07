import { Search, X } from "lucide-react";
import { searchComponentsRich } from "@/data/search";
import { engineSystems, systemById } from "@/data/systems";
import { useExplorer } from "@/store/explorer";
import { cn } from "@/lib/cn";
import { panelShell } from "./chrome";

const QUICK_ISSUES = [
  { label: "Misfire", query: "misfire" },
  { label: "Oil leak", query: "oil leak" },
  { label: "Boost leak", query: "boost leak" },
  { label: "Overheat", query: "overheat" },
] as const;

export function PartsNav({ onPick, plain }: { onPick?: () => void; plain?: boolean }) {
  const query = useExplorer((s) => s.query);
  const setQuery = useExplorer((s) => s.setQuery);
  const system = useExplorer((s) => s.systemFilter);
  const setSystem = useExplorer((s) => s.setSystem);
  const selected = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const appView = useExplorer((s) => s.appView);
  const searchId = plain ? "part-search-mobile" : "part-search";

  const list = searchComponentsRich(query).filter((component) => {
    if (component.bayOnly && appView !== "bay") return false;
    if (system !== "all" && component.system !== system) return false;
    return true;
  });

  const groups = engineSystems
    .filter((entry) => entry.id !== "all")
    .map((entry) => ({ ...entry, parts: list.filter((component) => component.system === entry.id) }))
    .filter((group) => group.parts.length);

  const filtered = Boolean(query.trim()) || system !== "all";

  return (
    <aside className={plain ? "flex h-full min-h-0 flex-col overflow-hidden bg-surface" : panelShell}>
      <div className="border-b border-border px-3 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="kicker">Find a component</p>
          <p className="font-mono text-[10px] tabular-nums text-muted">{list.length} {filtered ? "shown" : "parts"}</p>
        </div>
        <label className="sr-only" htmlFor={searchId}>Search parts or symptoms</label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted" strokeWidth={1.75} />
          <input
            id={searchId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Part or symptom…"
            className="h-11 w-full rounded-[4px] border border-border bg-bg/84 pr-10 pl-9 text-sm text-fg placeholder:text-muted"
            suppressHydrationWarning
          />
          {query ? (
            <button type="button" className="absolute top-0 right-0 inline-flex size-11 items-center justify-center text-muted hover:text-fg" onClick={() => setQuery("")} aria-label="Clear search">
              <X className="size-3.5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Common issues">
          {QUICK_ISSUES.map((issue) => (
            <button
              key={issue.query}
              type="button"
              onClick={() => {
                setSystem("all");
                setQuery(issue.query);
              }}
              className={cn(
                "h-10 rounded-[3px] border px-2.5 text-[11px] font-medium tracking-[0.02em] sm:h-8",
                "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
                query.toLowerCase() === issue.query
                  ? "border-border-strong bg-elevated text-fg"
                  : "border-border text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {issue.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hud-scroll flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5" aria-label="Filter by system">
        {engineSystems.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSystem(entry.id)}
            className={cn(
              "h-10 shrink-0 rounded-[3px] px-2.5 text-[11px] font-medium tracking-[0.02em] sm:h-9",
              "motion-safe:transition-[color,background-color] motion-safe:duration-150",
              system === entry.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
            aria-pressed={system === entry.id}
          >{entry.short}</button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-2" aria-label="Engine components">
        {groups.map((group) => (
          <section key={group.id} className="mb-2">
            <p className="sticky top-0 z-[1] bg-surface/96 px-3 py-2 backdrop-blur-sm"><span className="kicker">{group.index} · {group.label}</span></p>
            <ul>
              {group.parts.map((component) => (
                <li key={component.id}>
                  <button
                    type="button"
                    onClick={() => { select(component.id); onPick?.(); }}
                    className={cn(
                      "flex min-h-12 w-full flex-col items-start gap-1 border-l-2 px-3 py-2.5 text-left",
                      "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
                      selected === component.id ? "border-accent bg-elevated text-fg" : "border-transparent text-muted hover:bg-elevated/60 hover:text-fg",
                    )}
                  >
                    <span className="text-sm font-medium text-fg">{component.canonicalName}</span>
                    <span className="text-xs text-muted">
                      {component.bayOnly ? "Engine bay" : component.diagramOnly ? "Diagram only" : systemById[component.system]?.short}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {list.length === 0 ? (
          <div className="px-3 py-6">
            <p className="text-sm text-fg">No matching component.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">Try a part name, common alias, or a shorter symptom phrase.</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
