import { useState } from "react";
import { X } from "lucide-react";
import { componentById } from "@/data/components";
import { sources, authorityLabel } from "@/data/sources";
import { meshIdentity } from "@/lib/mesh-identity";
import { hitsForPart } from "@/engine/photo-views";
import { useExplorer } from "@/store/explorer";
import { cn } from "@/lib/cn";
import { chipBtn, iconBtn, panelShell } from "./chrome";

function Pill({ children, tone = "accent" }: { children: string; tone?: "accent" | "warn" | "ok" | "muted" }) {
  const color =
    tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : tone === "muted" ? "text-muted" : "text-accent";
  return <span className={cn("text-2xs uppercase tracking-wide", color)}>{children}</span>;
}

export function Inspector({ onClose, plain }: { onClose?: () => void; plain?: boolean }) {
  const selectedId = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const visualMode = useExplorer((s) => s.visualMode);
  const [openHow, setOpenHow] = useState(true);
  const part = selectedId ? componentById[selectedId] : null;
  const ident = selectedId ? meshIdentity[selectedId] : null;
  const shell = plain ? "flex h-full min-h-0 flex-col overflow-hidden bg-surface" : panelShell;

  if (!part) {
    return (
      <aside className={shell}>
        <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <p className="text-2xs uppercase tracking-wide text-muted">Component</p>
            <h2 className="mt-1 text-sm text-fg">Nothing selected</h2>
          </div>
          {onClose ? (
            <button type="button" className={iconBtn} aria-label="Close inspector" onClick={onClose}>
              <X className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-muted">
          <p>Click the engine, or pick a part from the catalogue.</p>
          <p className="text-2xs uppercase tracking-wide text-subtle">↑↓ to step · Esc to clear</p>
          {visualMode !== "photo" && (
            <p className="text-2xs leading-relaxed text-subtle">
              {visualMode === "xray"
                ? "X-ray is a schematic of the 3D reconstruction. The photograph is under Photo."
                : "You are looking at a schematic 3D reconstruction, not the real photograph."}
            </p>
          )}
        </div>
      </aside>
    );
  }

  const confidenceTone = part.confidence === "verified" ? "ok" : part.confidence === "medium" ? "warn" : "accent";

  return (
    <aside className={shell}>
      <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-2xs uppercase tracking-wide text-muted">Component</p>
          <h2 className="mt-1 text-base font-medium text-balance text-fg">{part.canonicalName}</h2>
          <p className="mt-1 text-2xs uppercase tracking-wide text-subtle">{part.system}</p>
        </div>
        <button
          type="button"
          className={iconBtn}
          aria-label="Clear selection"
          onClick={() => {
            select(null);
            onClose?.();
          }}
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="space-y-2">
          <p className="text-2xs uppercase tracking-wide text-muted">Function</p>
          <p className="text-sm leading-relaxed text-pretty text-fg">{part.function}</p>
        </section>
        <section className="mt-5 space-y-2">
          <p className="text-2xs uppercase tracking-wide text-muted">Location on the N20</p>
          <p className="text-sm leading-relaxed text-pretty text-fg">{part.location}</p>
        </section>
        <section className="mt-5 space-y-2">
          <p className="text-2xs uppercase tracking-wide text-muted">Connected to</p>
          <div className="flex flex-wrap gap-1">
            {part.connectsTo.map((id) => {
              const c = componentById[id];
              if (!c) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className={cn(chipBtn, "border border-border text-fg")}
                  onClick={() => select(id)}
                >
                  {c.canonicalName}
                </button>
              );
            })}
          </div>
        </section>
        {part.howItWorks && (
          <section className="mt-5">
            <button
              type="button"
              className="h-11 text-2xs uppercase tracking-wide text-muted hover:text-fg"
              onClick={() => setOpenHow((v) => !v)}
              aria-expanded={openHow}
            >
              How it works
            </button>
            {openHow && <p className="mt-1 text-sm leading-relaxed text-pretty text-fg">{part.howItWorks}</p>}
          </section>
        )}
        {part.inspectionNotes && (
          <section className="mt-5 space-y-2">
            <p className="text-2xs uppercase tracking-wide text-muted">Inspection</p>
            <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-fg">
              {part.inspectionNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {part.serviceAccess && <p className="text-sm text-muted">{part.serviceAccess}</p>}
          </section>
        )}
        {part.commonSymptoms && (
          <section className="mt-5 space-y-2">
            <p className="text-2xs uppercase tracking-wide text-muted">Associated symptoms</p>
            <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-fg">
              {part.commonSymptoms.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="text-2xs text-subtle">Symptoms are associations, not a diagnosis.</p>
          </section>
        )}
        <section className="mt-5 space-y-2 border-t border-border pt-4">
          <p className="text-2xs uppercase tracking-wide text-muted">OEM identification</p>
          <p className="text-sm text-fg">
            {part.partNumberStatus === "vin-required" ? (
              <Pill tone="warn">VIN required for exact OE component</Pill>
            ) : part.partNumberStatus === "not-applicable" ? (
              "Not applicable"
            ) : (
              part.bmwPartNumber
            )}
          </p>
        </section>
        <section className="mt-5 space-y-2">
          <p className="text-2xs uppercase tracking-wide text-muted">Confidence</p>
          <p className="text-sm text-fg">
            <Pill tone={confidenceTone}>{part.confidence}</Pill>
            {ident ? ` · capture ${ident.status}` : null}
          </p>
          {ident && <p className="text-2xs leading-relaxed text-subtle">{ident.basis}</p>}
          {hitsForPart(part.id).length === 0 ? (
            <p className="text-2xs leading-relaxed text-warn">
              Not marked on the current photographs — identified from ST1111 / service references, not from a visible
              region in the capture set.
            </p>
          ) : visualMode === "photo" ? (
            <p className="text-2xs leading-relaxed text-subtle">
              Highlighted on the photographic plate. The outline is an overlay — the surface remains the photograph.
            </p>
          ) : (
            <p className="text-2xs leading-relaxed text-subtle">
              Highlighted on the 3D schematic. Switch to Photo to see the same component on the real engine.
            </p>
          )}
        </section>
        <section className="mt-5 space-y-2">
          <p className="text-2xs uppercase tracking-wide text-muted">Sources</p>
          <ul className="space-y-2">
            {part.sourceRefs.map((id) => {
              const s = sources[id];
              if (!s) return null;
              return (
                <li key={id} className="text-2xs leading-relaxed text-muted">
                  <span className="text-accent">{authorityLabel(s.authorityLevel)}</span>
                  {" · "}
                  {s.url ? (
                    <a
                      href={s.url}
                      className="underline-offset-2 hover:text-fg hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </aside>
  );
}
