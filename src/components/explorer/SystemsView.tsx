import { ChevronRight } from "lucide-react";
import { componentById } from "@/data/components";
import { useExplorer } from "@/store/explorer";

const PATHS: { title: string; note: string; ids: string[] }[] = [
  {
    title: "Intake air / boost",
    note: "ST1111 path. Intercooler lives in the cooling pack, not on the engine.",
    ids: ["airbox", "turbocharger", "boost-pipe", "intercooler", "charge-pipe", "throttle-body", "intake-manifold"],
  },
  {
    title: "Exhaust",
    note: "Twin-scroll pairing 1+4 / 2+3. Catalyst body is an interface only.",
    ids: ["exhaust-manifold", "turbocharger", "wastegate", "catalyst-interface"],
  },
  {
    title: "Fuel",
    note: "Low-pressure supply into the engine is not modelled. HPFP is cam-driven.",
    ids: ["hpfp", "fuel-rail", "injectors"],
  },
  {
    title: "Lubrication",
    note: "ST1111: heat exchanger sits in the circuit ahead of the filter (raw-oil cooling).",
    ids: ["oil-sump", "oil-filter-module", "oil-cooler", "oil-cap"],
  },
  {
    title: "Cooling",
    note: "Electric pump — not belt-driven. Map thermostat 97–109 °C per ST1111.",
    ids: ["electric-coolant-pump", "map-thermostat", "oil-cooler"],
  },
  {
    title: "Ignition & valvetrain",
    note: "TVDI: Valvetronic meters air; throttle is auxiliary.",
    ids: ["ignition-coils", "valvetronic-motor", "vanos-intake", "vanos-exhaust", "dme"],
  },
];

export function SystemsView() {
  const select = useExplorer((s) => s.select);
  const selected = useExplorer((s) => s.selectedId);
  const setAppView = useExplorer((s) => s.setAppView);

  return (
    <div className="h-full overflow-y-auto bg-bg">
      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <p className="text-2xs uppercase tracking-wide text-accent">Systems</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-balance text-fg">How the N20 is put together</h1>
        <p className="mt-4 text-sm leading-relaxed text-pretty text-muted">
          Each path is limited to segments verified in BMW ST1111 or corroborating technical references. Unknown hose
          routes are omitted rather than invented. Selecting a node opens that component on the engine.
        </p>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {PATHS.map((path) => (
            <section key={path.title} className="py-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-medium tracking-tight text-fg">{path.title}</h2>
                <span className="hidden font-mono text-[9px] tabular-nums text-subtle sm:inline">{String(path.ids.length).padStart(2, "0")} nodes</span>
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-subtle">{path.note}</p>
              <ol className="mt-4 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center">
                {path.ids.map((id, i) => {
                  const c = componentById[id];
                  if (!c) return null;
                  return (
                    <li key={id} className="flex items-center gap-1">
                      {i > 0 ? (
                        <ChevronRight className="hidden size-3.5 shrink-0 text-subtle sm:block" strokeWidth={1.75} />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          select(id);
                          if (!c.bayOnly) setAppView("engine");
                          else setAppView("bay");
                        }}
                        className={`min-h-11 border-l px-3 py-2 text-left text-sm motion-safe:transition-colors motion-safe:duration-150 ${
                          selected === id
                            ? "border-accent bg-elevated text-fg"
                            : "border-border text-muted hover:border-border-strong hover:bg-elevated/60 hover:text-fg"
                        }`}
                        aria-pressed={selected === id}
                      >
                        {c.canonicalName}
                        {c.diagramOnly || c.bayOnly ? (
                          <span className="ml-2 text-2xs uppercase tracking-wide text-subtle">
                            {c.bayOnly ? "bay" : "diagram"}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
