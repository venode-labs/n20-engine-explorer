import { useEffect } from "react";
import { components, searchComponents } from "@/data/components";
import { useExplorer } from "@/store/explorer";

export function useHotkeys() {
  const select = useExplorer((s) => s.select);
  const setVinOpen = useExplorer((s) => s.setVinOpen);
  const setHelpOpen = useExplorer((s) => s.setHelpOpen);
  const setPaletteOpen = useExplorer((s) => s.setPaletteOpen);
  const setVisualMode = useExplorer((s) => s.setVisualMode);
  const setMaterialMode = useExplorer((s) => s.setMaterialMode);
  const setCompareMode = useExplorer((s) => s.setCompareMode);
  const setExplode = useExplorer((s) => s.setExplode);
  const resetView = useExplorer((s) => s.resetView);
  const selectedId = useExplorer((s) => s.selectedId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      const s = useExplorer.getState();

      if (e.key === "Escape") {
        if (s.paletteOpen) {
          setPaletteOpen(false);
          return;
        }
        if (s.helpOpen) {
          setHelpOpen(false);
          return;
        }
        if (s.vinOpen) {
          setVinOpen(false);
          return;
        }
        select(null);
        return;
      }

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!s.paletteOpen);
        return;
      }

      if (typing) return;

      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setHelpOpen(!s.helpOpen);
        return;
      }
      if (e.key === "1") setVisualMode("photo");
      if (e.key === "2") setVisualMode("model");
      if (e.key === "3") setVisualMode("xray");
      if (e.key === "i" || e.key === "I") setMaterialMode(s.materialMode === "context" ? "normal" : "context");
      if (e.key === "c" || e.key === "C") setCompareMode(!s.compareMode);
      if (e.key === "r" || e.key === "R") resetView();
      if (e.key === "e" || e.key === "E") {
        const next = s.explode < 0.2 ? 0.55 : s.explode < 0.8 ? 1 : 0;
        setExplode(next);
        if (s.visualMode === "photo") setVisualMode("model");
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const pool = searchComponents(s.query).filter((c) => {
        if (c.bayOnly && s.appView !== "bay") return false;
        if (s.systemFilter !== "all" && c.system !== s.systemFilter) return false;
        return true;
      });
      const ids = (pool.length ? pool : components.filter((c) => !c.bayOnly)).map((c) => c.id);
      const idx = selectedId ? ids.indexOf(selectedId) : -1;
      const next =
        e.key === "ArrowDown" ? ids[Math.min(ids.length - 1, idx + 1)] : ids[Math.max(0, idx <= 0 ? 0 : idx - 1)];
      if (next) select(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    select,
    selectedId,
    setVinOpen,
    setHelpOpen,
    setPaletteOpen,
    setVisualMode,
    setMaterialMode,
    setCompareMode,
    setExplode,
    resetView,
  ]);
}
