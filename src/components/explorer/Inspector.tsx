import { useState, type ReactNode } from "react";
import { Box, Camera, Scan, X } from "lucide-react";
import { componentById } from "@/data/components";
import { sources, authorityLabel } from "@/data/sources";
import { systemById } from "@/data/systems";
import { meshIdentity } from "@/lib/mesh-identity";
import { hitsForPart, type PhotoId } from "@/engine/photo-views";
import { useExplorer, type VisualMode } from "@/store/explorer";
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

export function Inspector({ onClose, plain, photoId }: { onClose?: () => void; plain?: boolean; photoId: PhotoId }) {
  const selectedId = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const setVisualMode = useExplorer((s) => s.setVisualMode);
  const currentVisual = useExplorer((s) => s.visualMode);
  const setAppView = useExplorer((s) => s.setAppView);
  const [openHow, setOpenHow] = useState(false);
  const part = selectedId ? componentById[selectedId] : null;
  const ident = selectedId ? meshIdentity[selectedId] : null;
  const shell = plain ? "flex h-full min-h-0 flex-col overflow-hidden bg-surface" : panelShell;

  if (!part) {
    return (
      <aside className={shell}>
        {!plain ? (
          <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-4">
            <div>
              <p className="kicker">Current engine</p>
              <h2 className="mt-1 text-base font-medium tracking-tight text-fg">BMW N20B20</h2>
            </div>
            {onClose ? (
              <button type="button" className={iconBtn} aria-label="Close inspector" onClick={onClose}>
                <X className="size-4" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="space-y-4 px-4 py-4 text-sm leading-relaxed text-muted">
          {plain ? (
            <div>
              <p className="kicker">Current engine</p>
              <p className="mt-1 text-base font-medium tracking-tight text-fg">BMW N20B20</p>
            </div>
          ) : null}
          <p>Select a marked area on the engine or search for a part or symptom.</p>
          <p>Photo is the visual source of truth. 3D and X-ray are orientation schematics.</p>
        </div>
      </aside>
    );
  }

  const sys = systemById[part.system];
  const confidenceTone = part.confidence === "verified" ? "ok" : part.confidence === "medium" ? "warn" : "accent";
  const photoHits = hitsForPart(part.id);
  const currentPhotoHit = photoHits.find((hit) => hit.photo === photoId);
  const preferredPhotoHit = currentPhotoHit ?? photoHits[0];
  const onPlate = Boolean(currentPhotoHit);
  const hasVerifiedPhoto = photoHits.length > 0;
  const canSchematic = !part.bayOnly && Boolean(ident && ident.status !== "unidentified");
  const schematicOnly = !onPlate && !part.bayOnly;

  const refocus = () => requestAnimationFrame(() => select(part.id, { frame: true }));

  const showPhoto = () => {
    if (!preferredPhotoHit) return;
    setAppView(preferredPhotoHit.photo === "bay" ? "bay" : "engine");
    setVisualMode("photo");
    refocus();
  };

  const showSchematic = (mode: Extract<VisualMode, "model" | "xray">) => {
    if (!canSchematic) return;
    setAppView("engine");
    setVisualMode(mode);
    refocus();
  };

  return (
    <aside className={shell}>
      {!plain ? (
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
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {plain ? (
          <p className="kicker mb-2">
            {sys?.index} · {sys?.label ?? part.system}
          </p>
        ) : null}

        <p className="text-sm leading-relaxed text-pretty text-fg">{part.function}</p>

        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Locate component">
          {hasVerifiedPhoto ? (
            <button
              type="button"
              className={cn(chipBtn, "border border-border", currentVisual === "photo" && onPlate && "bg-elevated text-fg")}
              onClick={showPhoto}
              aria-pressed={currentVisual === "photo" && onPlate}
            >
              <Camera className="mr-1 size-3.5" strokeWidth={1.75} />
              Show on photo
            </button>
          ) : null}
          {canSchematic ? (
            <>
              <button
                type="button"
                className={cn(chipBtn, "border border-border", currentVisual === "model" && "bg-elevated text-fg")}
                onClick={() => showSchematic("model")}
                aria-pressed={currentVisual === "model"}
              >
                <Box className="mr-1 size-3.5" strokeWidth={1.75} />
                Inspect in 3D
              </button>
              <button
                type="button"
                className={cn(chipBtn, "border border-border", currentVisual === "xray" && "bg-elevated text-fg")}
                onClick={() => showSchematic("xray")}
                aria-pressed={currentVisual === "xray"}
              >
                <Scan className="mr-1 size-3.5" strokeWidth={1.75} />
                X-ray
              </button>
            </>
          ) : null}
        </div>

        {schematicOnly && currentVisual === "photo" ? (
          canSchematic ? (
            <button
              type="button"
              onClick={() => showSchematic("model")}
              className="mt-4 flex w-full items-center gap-2 rounded-[4px] border border-border bg-elevated px-3 py-2.5 text-left text-xs text-fg hover:border-border-strong"
            >
              <Box className="size-3.5 shrink-0 text-accent" strokeWidth={1.75} />
              Not marked on this photograph. Open the 3D schematic.
            </button>
          ) : (
            <p className="mt-4 border-l border-warn px-3 py-2 text-xs leading-relaxed text-muted">
              Not marked on this photograph. No verified schematic target is available for this component.
            </p>
          )
        ) : null}

        {part.bayOnly && !onPlate ? (
          <button
            type="button"
            onClick={() => setAppView("bay")}
            className="mt-4 w-full rounded-[4px] border border-border bg-elevated px-3 py-2.5 text-left text-xs text-fg"
          >
            This component belongs to the engine-bay context rather than the isolated display engine.
          </button>
        ) : null}

        <Section title="Location">
          <p className="text-sm leading-relaxed text-pretty text-fg">{part.location}</p>
        </Section>

        {(part.inspectionNotes?.length || part.serviceAccess) ? (
          <Section title="What to inspect">
            {part.inspectionNotes?.length ? (
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg">
                {part.inspectionNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
            {part.serviceAccess ? (
              <p className="border-l border-border-strong pl-3 text-sm leading-relaxed text-muted">
                <span className="font-medium text-fg">Access: </span>
                {part.serviceAccess}
              </p>
            ) : null}
          </Section>
        ) : null}

        {part.commonSymptoms?.length ? (
          <Section title="Associated symptoms">
            <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg">
              {part.commonSymptoms.map((symptom) => (
                <li key={symptom}>{symptom}</li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-muted">Symptoms are associations, not a diagnosis.</p>
          </Section>
        ) : null}

        {part.connectsTo.length ? (
          <Section title="Related components">
            <div className="flex flex-wrap gap-1">
              {part.connectsTo.map((id) => {
                const connected = componentById[id];
                if (!connected) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    className={cn(chipBtn, "border border-border text-fg")}
                    onClick={() => select(id)}
                  >
                    {connected.canonicalName}
                  </button>
                );
              })}
            </div>
          </Section>
        ) : null}

        {part.howItWorks ? (
          <section className="mt-5 border-t border-border/70 pt-3">
            <button
              type="button"
              className="min-h-10 text-xs font-medium text-muted hover:text-fg"
              onClick={() => setOpenHow((value) => !value)}
              aria-expanded={openHow}
            >
              {openHow ? "Hide" : "Show"} how it works
            </button>
            {openHow ? <p className="mt-1 text-sm leading-relaxed text-pretty text-fg">{part.howItWorks}</p> : null}
          </section>
        ) : null}

        <details className="mt-5 border-t border-border/70 pt-3">
          <summary className="cursor-pointer select-none text-xs font-medium text-muted hover:text-fg">
            Technical verification
          </summary>
          <div className="pb-2">
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

            <Section title="Evidence status">
              <p className="text-sm text-fg">
                <Pill tone={confidenceTone}>{part.confidence}</Pill>
                {ident ? ` · schematic ${ident.status}` : null}
              </p>
              {ident ? <p className="text-xs leading-relaxed text-muted">{ident.basis}</p> : null}
              {!onPlate ? (
                <p className="text-xs leading-relaxed text-warn">
                  This component is not marked on the current photograph. Its identity comes from technical references,
                  not from a visible region on this plate.
                </p>
              ) : currentVisual === "photo" ? (
                <p className="text-xs leading-relaxed text-muted">
                  The highlight is an interaction overlay on the licensed source photograph; it does not replace the photographed surface.
                </p>
              ) : null}
            </Section>

            <Section title="Sources">
              <ul className="space-y-2">
                {part.sourceRefs.map((id) => {
                  const source = sources[id];
                  if (!source) return null;
                  return (
                    <li key={id} className="text-xs leading-relaxed text-muted">
                      <span className="text-accent">{authorityLabel(source.authorityLevel)}</span>
                      {" · "}
                      {source.url ? (
                        <a
                          href={source.url}
                          className="underline-offset-2 hover:text-fg hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.title}
                        </a>
                      ) : (
                        source.title
                      )}
                    </li>
                  );
                })}
              </ul>
            </Section>
          </div>
        </details>
      </div>
    </aside>
  );
}
