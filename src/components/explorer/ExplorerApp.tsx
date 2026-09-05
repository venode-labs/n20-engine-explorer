import { useEffect, useState } from "react";
import { List, PanelRight } from "lucide-react";
import { useProgress } from "@react-three/drei";
import { EngineCanvas } from "@/engine/EngineCanvas";
import { photoViews } from "@/engine/photo-views";
import { componentById, components } from "@/data/components";
import { PART_FOCUS, presetById } from "@/data/camera-presets";
import { useExplorer } from "@/store/explorer";
import { Header } from "./Header";
import { HoverChip } from "./HoverChip";
import { Inspector } from "./Inspector";
import { PartsNav } from "./PartsNav";
import { SystemsView } from "./SystemsView";
import { TechnicalView } from "./TechnicalView";
import { ViewBar } from "./ViewBar";
import { VinPanel } from "./VinPanel";
import { BottomSheet, SideSheet } from "./Sheet";
import { iconBtn } from "./chrome";

function PlateLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg">
      <p className="text-2xs uppercase tracking-[0.18em] text-muted">
        Photographic plate {Math.round(progress)}%
      </p>
    </div>
  );
}

export function ExplorerApp() {
  const appView = useExplorer((s) => s.appView);
  const selectedId = useExplorer((s) => s.selectedId);
  const select = useExplorer((s) => s.select);
  const webgl = useExplorer((s) => s.webgl);
  const compare = useExplorer((s) => s.compareMode);
  const visualMode = useExplorer((s) => s.visualMode);
  const cameraPreset = useExplorer((s) => s.cameraPreset);
  const setVinOpen = useExplorer((s) => s.setVinOpen);
  const selected = selectedId ? componentById[selectedId] : null;
  const [navOpen, setNavOpen] = useState(false);
  const [inspOpen, setInspOpen] = useState(false);

  const fromPart = selectedId ? PART_FOCUS[selectedId]?.photo : undefined;
  const fromPreset = presetById[cameraPreset]?.photo;
  const photoId = appView === "bay" ? "bay" : (fromPart ?? fromPreset ?? "welt");
  const photo = photoViews[photoId];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const part = params.get("part");
    if (part && componentById[part]) select(part, { frame: true });
  }, [select]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("part", selectedId);
    else url.searchParams.delete("part");
    window.history.replaceState(null, "", url);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId && window.matchMedia("(max-width: 1023px)").matches) {
      setInspOpen(true);
    }
  }, [selectedId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") {
        if (useExplorer.getState().vinOpen) {
          setVinOpen(false);
          return;
        }
        select(null);
        setNavOpen(false);
        setInspOpen(false);
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const ids = components.filter((c) => !c.bayOnly).map((c) => c.id);
      const idx = selectedId ? ids.indexOf(selectedId) : -1;
      const next =
        e.key === "ArrowDown" ? ids[Math.min(ids.length - 1, idx + 1)] : ids[Math.max(0, idx <= 0 ? 0 : idx - 1)];
      if (next) select(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, selectedId, setVinOpen]);

  const showEngine = appView === "engine" || appView === "bay";
  const schematic = visualMode !== "photo";
  const splitCompare = compare && !schematic;

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <a
        href="#exhibit"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to exhibit
      </a>
      <Header />
      {appView === "technical" ? (
        <TechnicalView />
      ) : appView === "systems" ? (
        <SystemsView />
      ) : (
        <div id="exhibit" className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            {!webgl ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="max-h-[70%] max-w-full object-contain outline outline-1 -outline-offset-1 outline-white/10"
                />
                <p className="max-w-sm text-center text-sm text-muted">
                  WebGL is not available. The photographic plate is shown as a still. Use the catalogue to inspect
                  components.
                </p>
              </div>
            ) : (
              <div
                className={
                  splitCompare
                    ? "grid h-full min-h-0 grid-rows-2 md:grid-rows-1 md:grid-cols-2"
                    : "h-full min-h-0"
                }
              >
                {splitCompare && (
                  <figure className="relative min-h-0 overflow-hidden border-b border-border bg-bg md:border-r md:border-b-0">
                    <img
                      src={photo.fullSrc}
                      alt={`Source photograph: ${photo.label}`}
                      className="h-full w-full object-contain outline outline-1 -outline-offset-1 outline-white/10"
                    />
                    <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-border bg-surface/90 px-3 py-2 text-2xs leading-relaxed text-muted">
                      Source photograph — {photo.credit}. {photo.license}.
                    </figcaption>
                  </figure>
                )}
                <div className="relative min-h-0 overflow-hidden">
                  <EngineCanvas photoId={photoId} />
                  {!schematic && <PlateLoader />}
                  <div className="exhibit-vignette" />
                  {schematic && (
                    <p className="pointer-events-none absolute bottom-16 left-1/2 z-10 w-[min(100%-2rem,28rem)] -translate-x-1/2 text-center text-2xs leading-relaxed text-subtle lg:bottom-20">
                      {visualMode === "xray"
                        ? "X-ray schematic — cover removed, shells translucent. Not a CT scan. Layout from ST1111."
                        : "3D schematic reconstruction — not the photographed engine. Use Photo for the real N20."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <HoverChip />

          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute top-3 bottom-20 left-3 hidden w-72 lg:block">
              <PartsNav />
            </div>
            <div className="pointer-events-auto absolute top-3 right-3 bottom-20 hidden w-80 lg:block">
              <Inspector />
            </div>

            <div className="pointer-events-auto absolute top-3 left-3 flex gap-2 lg:hidden">
              <button type="button" className={`${iconBtn} hud-panel`} onClick={() => setNavOpen(true)} aria-label="Open parts">
                <List className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="pointer-events-auto absolute top-3 right-3 flex gap-2 lg:hidden">
              <button
                type="button"
                className={`${iconBtn} hud-panel`}
                onClick={() => setInspOpen(true)}
                aria-label={selected ? selected.canonicalName : "Open inspector"}
              >
                <PanelRight className="size-4" strokeWidth={1.75} />
              </button>
            </div>

            {showEngine && (
              <div className="pointer-events-auto absolute right-3 bottom-3 left-3 lg:right-auto lg:left-1/2 lg:w-[min(100%-24rem,52rem)] lg:-translate-x-1/2">
                <ViewBar />
              </div>
            )}
          </div>
        </div>
      )}
      <VinPanel />
      <SideSheet open={navOpen} onOpenChange={setNavOpen} title="Catalogue">
        <PartsNav plain onPick={() => setNavOpen(false)} />
      </SideSheet>
      <BottomSheet
        open={inspOpen}
        onOpenChange={setInspOpen}
        title={selected ? selected.canonicalName : "Inspector"}
      >
        <div className="h-[min(70vh,32rem)]">
          <Inspector plain onClose={() => setInspOpen(false)} />
        </div>
      </BottomSheet>
      <p className="sr-only">
        Independent photographic visualisation of a real BMW N20. Not affiliated with BMW AG.
        {selected ? ` Selected: ${selected.canonicalName}.` : ""}
      </p>
    </div>
  );
}
