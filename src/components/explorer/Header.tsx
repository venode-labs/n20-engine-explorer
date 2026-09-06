import { Hash, Keyboard } from "lucide-react";
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
  const setHelpOpen = useExplorer((s) => s.setHelpOpen);

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-stretch border-b border-border bg-bg/96 px-3 pt-[env(safe-area-inset-top)] sm:px-4">
      <div className="flex min-w-0 shrink-0 items-center gap-2.5">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-fg sm:text-[13px]">VISCERRA</p>
        <span className="hidden h-4 w-px bg-border md:block" />
        <p className="hidden text-xs tracking-[0.08em] text-muted md:block">N20B20 · F32</p>
      </div>

      <nav className="hud-scroll mx-auto min-w-0 overflow-x-auto" aria-label="Primary">
        <div className="flex h-full items-stretch">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setAppView(v.id)}
              className={cn(
                "relative flex h-full min-w-12 items-center justify-center px-2 text-[11px] font-medium tracking-[0.04em] sm:min-w-16 sm:px-3 sm:text-xs",
                "text-muted transition-colors duration-150 hover:text-fg",
                appView === v.id && "text-fg",
              )}
              aria-current={appView === v.id ? "page" : undefined}
            >
              {v.label}
              {appView === v.id ? <span className="absolute right-2 bottom-0 left-2 h-px bg-accent sm:right-3 sm:left-3" /> : null}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex shrink-0 items-center justify-end gap-0.5">
        <span className="hidden text-xs tracking-[0.06em] text-muted xl:inline">2015 · AU</span>
        <button
          type="button"
          className="hidden size-11 items-center justify-center text-muted hover:bg-elevated/70 hover:text-fg md:inline-flex"
          onClick={() => setHelpOpen(true)}
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="size-4" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center gap-1.5 text-xs font-medium tracking-[0.06em] text-fg hover:bg-elevated/70 sm:w-auto sm:px-2.5"
          onClick={() => setVinOpen(true)}
          aria-label="VIN"
        >
          <Hash className="size-3.5 text-muted" strokeWidth={1.6} />
          <span className="hidden sm:inline">VIN</span>
        </button>
      </div>
    </header>
  );
}
