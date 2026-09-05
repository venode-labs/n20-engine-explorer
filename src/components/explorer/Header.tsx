import { Hash } from "lucide-react";
import { useExplorer } from "@/store/explorer";
import { cn } from "@/lib/cn";

const views = [
  { id: "engine", label: "Engine" },
  { id: "systems", label: "Systems" },
  { id: "bay", label: "Bay" },
  { id: "technical", label: "Notes" },
] as const;

export function Header() {
  const appView = useExplorer((s) => s.appView);
  const setAppView = useExplorer((s) => s.setAppView);
  const setVinOpen = useExplorer((s) => s.setVinOpen);

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-bg px-2 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 shrink-0 items-baseline gap-2">
        <p className="text-sm font-medium tracking-tight text-fg">N20</p>
        <p className="hidden truncate text-xs text-muted md:block">Engine Explorer</p>
      </div>

      <nav className="hud-scroll mx-auto flex h-11 min-w-0 items-center overflow-x-auto" aria-label="Primary">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setAppView(v.id)}
            className={cn(
              "h-11 shrink-0 border-b-2 px-3 text-xs tracking-wide sm:px-4",
              "motion-safe:transition-[color,border-color] motion-safe:duration-150",
              appView === v.id
                ? "border-accent text-fg"
                : "border-transparent text-muted hover:text-fg",
            )}
            aria-current={appView === v.id ? "page" : undefined}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <span className="hidden text-2xs text-muted xl:inline">2015 F32 · Australia</span>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-xs tracking-wide text-fg hover:bg-elevated active:scale-[0.96] motion-safe:transition-[transform,background-color] motion-safe:duration-150 sm:px-3"
          onClick={() => setVinOpen(true)}
        >
          <Hash className="size-3.5 text-muted" strokeWidth={1.75} />
          <span>VIN</span>
        </button>
      </div>
    </header>
  );
}
