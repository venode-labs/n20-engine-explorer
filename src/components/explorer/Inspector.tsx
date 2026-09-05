import { useState, type ReactNode } from "react";
import { Box, Camera, Scan, X } from "lucide-react";
import { componentById } from "@/data/components";
import { sources, authorityLabel } from "@/data/sources";
import { systemById } from "@/data/systems";
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 space-y-2">
      <p className="kicker">{title}</p>
      {children}
    </section>
  );
}

export function Inspector({ onClose, plain }: { onClose?: () => void; plain?: boolean }) {
  const selectedId = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const visualMode = useExplorer((s) => s.setVisualMode);
  const currentVisual = useExplorer((s) => s.visualMode);
  const setAppView = useExplorer((s) => s.setAppView);
  const [openHow, setOpenHow] = useState(true);
  const part = selectedId ? componentById[selectedId] : null;
  const ident = selectedId ? meshIdentity[selectedId] : null;
  const shell = plain ? "flex h-full min-h-0 flex-col overflow-hidden bg-surface" : panelShell;

  if (!part) {
    return (
      <aside className={shell}>
        <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-4">
          <div>
            <p className="kicker">Exhibit 01</p>
            <h2 className="mt-1 text-base font-medium tracking-tight text-fg">BMW N20B20</h2>
          </div>
          {onClose ? (
            <button type="button" className={iconBtn} aria-label="Close inspector" onClick={onClose}>
              <X className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        <div className="space-y-4 px-4 py-4 text-sm leading-relaxed text-muted">
          <p>2015 428i F32 · Australia · RHD. The plate is a photograph of a physical N20.</p>
          <p>Click the engine, pick from the catalogue, or press / to search.</p>
          <p className="kicker">↑↓ step · Esc clear · 1–3 views</p>
        </div>
      </aside>
    );
  }

  const sys = systemById[part.system];
  const confidenceTone = part.confidence === "verified" ? "ok" : part.confidence === "medium" ? "warn" : "accent";
  const onPlate = hitsForPart(part.id).length > 0;
  const schematicOnly = !onPlate && !part.bayOnly;

  return (
    <aside className={shell}>
      <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-4">
        <div className="min-w-0">
          <p className="kicker">
            {sys?.index} · {sys?.label ?? part.system}
          </p>
          <h2 className="mt-1 text-lg font-medium tracking-tight text-balance text-fg">{part.canonicalName}</h2>
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
        <p className="text-sm leading-relaxed text-pretty text-fg">{part.function}</p>

        {schematicOnly && currentVisual === "photo" && (
          <button
            type="button"
            onClick={() => visualMode("model")}
            className="mt-4 flex w-full items-center gap-2 rounded-[4px] border border-border bg-elevated px-3 py-2.5 text-left text-xs text-fg hover:border-border-strong"
          >
            <Box className="size-3.5 shrink-0 text-accent" strokeWidth={1.75} />
            Not marked on this photograph. Open the 3D schematic.
          </button>
        )}
        {part.bayOnly && (
          <button
            type="button"
            onClick={() => setAppView("bay")}
            className="mt-4 w-full rounded-[4px] border border-border bg-elevated px-3 py-2.5 text-left text-xs text-fg"
          >
            This part lives in the engine bay, not on the isolated display engine.
          </button>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          <button type="button" className={cn(chipBtn, "border border-border")} onClick={() => visualMode("photo")}>
            <Camera className="mr-1 size-3.5" strokeWidth={1.75} />
            Photo
          </button>
          <button type="button" className={cn(chipBtn, "border border-border")} onClick={() => visualMode("model")}>
            <Box className="mr-1 size-3.5" strokeWidth={1.75} />
            3D
          </button>
          <button type="button" className={cn(chipBtn, "border border-border")} onClick={() => visualMode("xray")}>
            <Scan className="mr-1 size-3.5" strokeWidth={1.75} />
            X-ray
          </button>
        </div>

        <Section title="Location on the N20">
          <p className="text-sm leading-relaxed text-pretty text-fg">{part.location}</p>
        </Section>

        <Section title="Connected to">
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
        </Section>

        {part.howItWorks && (
          <section className="mt-5">
            <button
              type="button"
              className="h-9 text-2xs uppercase tracking-wide text-muted hover:text-fg"
              onClick={() => setOpenHow((v) => !v)}
              aria-expanded={openHow}
            >
              How it works
            </button>
            {openHow && <p className="mt-1 text-sm leading-relaxed text-pretty text-fg">{part.howItWorks}</p>}
          </section>
        )}

        {part.inspectionNotes && (
          <Section title="Inspection">
            <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-fg">
              {part.inspectionNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {part.serviceAccess && <p className="text-sm text-muted">{part.serviceAccess}</p>}
          </Section>
        )}

        {part.commonSymptoms && (
          <Section title="Associated symptoms">
            <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-fg">
              {part.commonSymptoms.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="text-2xs text-subtle">Symptoms are associations, not a diagnosis.</p>
          </Section>
        )}

        <Section title="OEM identification">
          <p className="text-sm text-fg">
            {part.bmwPartNumber ? (
              <>
                <span className="font-mono tracking-wide">{part.bmwPartNumber}</span>
                {part.partNumberStatus === "vin-required" ? (
                  <span className="mt-1 block">
                    <Pill tone="warn">VIN required to confirm</Pill>
                  </span>
                ) : null}
              </>
            ) : part.partNumberStatus === "vin-required" ? (
              <Pill tone="warn">VIN required for exact OE component</Pill>
            ) : part.partNumberStatus === "not-applicable" ? (
              "Not applicable"
            ) : (
              "Not listed"
            )}
          </p>
        </Section>

        <Section title="Confidence">
          <p className="text-sm text-fg">
            <Pill tone={confidenceTone}>{part.confidence}</Pill>
            {ident ? ` · capture ${ident.status}` : null}
          </p>
          {ident && <p className="text-2xs leading-relaxed text-subtle">{ident.basis}</p>}
          {!onPlate ? (
            <p className="text-2xs leading-relaxed text-warn">
              Not marked on the current photographs — identified from ST1111 / service references, not from a visible
              region in the capture set.
            </p>
          ) : currentVisual === "photo" ? (
            <p className="text-2xs leading-relaxed text-subtle">
              Highlighted on the photographic plate. The outline is an overlay — the surface remains the photograph.
            </p>
          ) : (
            <p className="text-2xs leading-relaxed text-subtle">
              Highlighted on the 3D schematic. Switch to Photo to see the same component on the real engine.
            </p>
          )}
        </Section>

        <Section title="Sources">
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
        </Section>
      </div>
    </aside>
  );
}
