import { useEffect, useState } from "react";
import { List, PanelRight } from "lucide-react";
import { useProgress } from "@react-three/drei";
import { EngineCanvas } from "@/engine/EngineCanvas";
import { photoViews } from "@/engine/photo-views";
import { componentById } from "@/data/components";
import { PART_FOCUS, presetById } from "@/data/camera-presets";
import { useExplorer } from "@/store/explorer";
import { Header } from "./Header";
import { Inspector } from "./Inspector";
import { PartsNav } from "./PartsNav";
import { SystemsView } from "./SystemsView";
import { TechnicalView } from "./TechnicalView";
import { VinPanel } from "./VinPanel";
import { ModeSwitch } from "./ModeSwitch";
import { StageDock } from "./StageDock";
import { StageReadout } from "./StageReadout";
import { CommandPalette } from "./CommandPalette";
import { HelpOverlay } from "./HelpOverlay";
import { HintOverlay } from "./HintOverlay";
import { BottomSheet, SideSheet } from "./Sheet";
import { iconBtn } from "./chrome";
import { useHotkeys } from "./useHotkeys";

function PlateLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg">
      <p className="kicker">Photographic plate {Math.round(progress)}%</p>
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
  const setVisualMode = useExplorer((s) => s.setVisualMode);
  const setAppView = useExplorer((s) => s.setAppView);
  const setExplode = useExplorer((s) => s.setExplode);
  const setQuery = useExplorer((s) => s.setQuery);
  const cameraPreset = useExplorer((s) => s.cameraPreset);
  const selected = selectedId ? componentById[selectedId] : null;
  const [navOpen, setNavOpen] = useState(false);
  const [inspOpen, setInspOpen] = useState(false);

  useHotkeys();

  const fromPart = selectedId ? PART_FOCUS[selectedId]?.photo : undefined;
  const fromPreset = presetById[cameraPreset]?.photo;
  const photoId = appView === "bay" ? "bay" : (fromPart ?? fromPreset ?? "welt");
  const photo = photoViews[photoId];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const part = params.get("part");
    const mode = params.get("mode");
    const view = params.get("view");
    const explode = params.get("explode");
    const q = params.get("q");

    if (mode === "photo" || mode === "model" || mode === "xray") setVisualMode(mode);
    if (view === "engine" || view === "systems" || view === "bay" || view === "technical") setAppView(view);
    if (explode != null && Number.isFinite(Number(explode))) setExplode(Math.min(1, Math.max(0, Number(explode))));
    if (q) setQuery(q.slice(0, 80));
    if (part && componentById[part]) select(part, { frame: true });
  }, [select, setAppView, setExplode, setQuery, setVisualMode]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("part", selectedId);
    else url.searchParams.delete("part");
    window.history.replaceState(null, "", url);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId && window.matchMedia("(max-width: 1023px)").matches) setInspOpen(true);
  }, [selectedId]);

  const showEngine = appView === "engine" || appView === "bay";
  const schematic = visualMode !== "photo";
  const splitCompare = compare && !schematic;

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <a href="#exhibit" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-3 focus:py-2">Skip to exhibit</a>
      <Header />
      {appView === "technical" ? <TechnicalView /> : appView === "systems" ? <SystemsView /> : (
        <div id="exhibit" className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            {!webgl ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
                <img src={photo.src} alt={photo.label} className="max-h-[70%] max-w-full object-contain outline outline-1 -outline-offset-1 outline-white/10" />
                <p className="max-w-sm text-center text-sm text-muted">WebGL is not available. The photographic plate is shown as a still. Use the catalogue to inspect components.</p>
              </div>
            ) : (
              <div className={splitCompare ? "grid h-full min-h-0 grid-rows-2 md:grid-rows-1 md:grid-cols-2" : "h-full min-h-0"}>
                {splitCompare && (
                  <figure className="relative min-h-0 overflow-hidden border-b border-border bg-bg md:border-r md:border-b-0">
                    <img src={photo.fullSrc} alt={`Source photograph: ${photo.label}`} className="h-full w-full object-contain outline outline-1 -outline-offset-1 outline-white/10" />
                    <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-border bg-surface/90 px-3 py-2 text-2xs leading-relaxed text-muted">Source photograph — {photo.credit}. {photo.license}.</figcaption>
                  </figure>
                )}
                <div className="relative h-full min-h-0 overflow-hidden">
                  <EngineCanvas photoId={photoId} />
                  {!schematic && <PlateLoader />}
                  <div className="exhibit-vignette" />
                </div>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className={selected ? "pointer-events-auto absolute top-3 left-1/2 z-20 -translate-x-1/2 lg:left-[calc(50%-2.5rem)]" : "pointer-events-auto absolute top-3 left-1/2 z-20 -translate-x-1/2 lg:left-[calc(50%+7.5rem)]"}>
              <ModeSwitch />
              <StageReadout />
            </div>

            <div className="pointer-events-auto absolute top-4 bottom-20 left-4 hidden w-60 lg:block"><PartsNav /></div>
            {selected && <div className="pointer-events-auto absolute top-4 right-4 bottom-20 hidden w-80 lg:block"><Inspector /></div>}

            <div className="pointer-events-auto absolute top-3 left-3 flex gap-2 lg:hidden">
              <button type="button" className={`${iconBtn} hud-panel`} onClick={() => setNavOpen(true)} aria-label="Open parts"><List className="size-4" strokeWidth={1.75} /></button>
            </div>
            <div className="pointer-events-auto absolute top-3 right-3 flex gap-2 lg:hidden">
              <button type="button" className={`${iconBtn} hud-panel`} onClick={() => setInspOpen(true)} aria-label={selected ? selected.canonicalName : "Open inspector"}><PanelRight className="size-4" strokeWidth={1.75} /></button>
            </div>

            {showEngine && (
              <div className={selected ? "pointer-events-auto absolute right-3 bottom-3 left-3 flex flex-col items-center gap-2 lg:right-auto lg:left-[calc(50%-2.5rem)] lg:w-[42rem] lg:max-w-[calc(100%_-_39rem)] lg:-translate-x-1/2" : "pointer-events-auto absolute right-3 bottom-3 left-3 flex flex-col items-center gap-2 lg:right-auto lg:left-[calc(50%+7.5rem)] lg:w-[46rem] lg:max-w-[calc(100%_-_19rem)] lg:-translate-x-1/2"}>
                <HintOverlay />
                <div className="w-full"><StageDock /></div>
              </div>
            )}
          </div>
        </div>
      )}
      <VinPanel />
      <CommandPalette />
      <HelpOverlay />
      <SideSheet open={navOpen} onOpenChange={setNavOpen} title="Catalogue"><PartsNav plain onPick={() => setNavOpen(false)} /></SideSheet>
      <BottomSheet open={inspOpen} onOpenChange={setInspOpen} title={selected ? selected.canonicalName : "Inspector"}>
        <div className="h-[min(70vh,32rem)]"><Inspector plain onClose={() => setInspOpen(false)} /></div>
      </BottomSheet>
      <p className="sr-only">Independent photographic visualisation of a real BMW N20. Not affiliated with BMW AG.{selected ? ` Selected: ${selected.canonicalName}.` : ""}</p>
    </div>
  );
}
