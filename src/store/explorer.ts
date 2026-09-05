import { create } from "zustand";
import { componentById, type EngineComponent } from "@/data/components";
import type { EngineSystemId } from "@/data/systems";

export type MaterialMode = "normal" | "context";
export type VisualMode = "photo" | "model" | "xray";
export type AppView = "engine" | "systems" | "bay" | "technical";

interface ExplorerState {
  selectedId: string | null;
  hoveredId: string | null;
  systemFilter: EngineSystemId;
  query: string;
  cameraPreset: string;
  cameraNonce: number;
  focusNonce: number;
  materialMode: MaterialMode;
  visualMode: VisualMode;
  appView: AppView;
  compareMode: boolean;
  vinDraft: string;
  vinOpen: boolean;
  webgl: boolean;
  select: (id: string | null, opts?: { frame?: boolean }) => void;
  hover: (id: string | null) => void;
  setSystem: (s: EngineSystemId) => void;
  setQuery: (q: string) => void;
  setPreset: (id: string) => void;
  resetView: () => void;
  setMaterialMode: (m: MaterialMode) => void;
  setVisualMode: (m: VisualMode) => void;
  setAppView: (v: AppView) => void;
  setCompareMode: (v: boolean) => void;
  setVinDraft: (v: string) => void;
  setVinOpen: (v: boolean) => void;
  setWebgl: (v: boolean) => void;
}

export const useExplorer = create<ExplorerState>((set) => ({
  selectedId: null,
  hoveredId: null,
  systemFilter: "all",
  query: "",
  cameraPreset: "hero",
  cameraNonce: 0,
  focusNonce: 0,
  materialMode: "normal",
  visualMode: "photo",
  appView: "engine",
  compareMode: false,
  vinDraft: "",
  vinOpen: false,
  webgl: true,
  select: (id, opts) =>
    set((s) => ({
      selectedId: id,
      focusNonce: opts?.frame === false || !id ? s.focusNonce : s.focusNonce + 1,
    })),
  hover: (id) => set({ hoveredId: id }),
  setSystem: (systemFilter) => set({ systemFilter }),
  setQuery: (query) => set({ query }),
  setPreset: (cameraPreset) => set((s) => ({ cameraPreset, cameraNonce: s.cameraNonce + 1 })),
  resetView: () =>
    set((s) => ({
      cameraPreset: s.appView === "bay" && s.visualMode === "photo" ? "bay" : "hero",
      cameraNonce: s.cameraNonce + 1,
      materialMode: "normal",
      compareMode: false,
    })),
  setMaterialMode: (materialMode) => set({ materialMode }),
  setVisualMode: (visualMode) =>
    set((s) => ({
      visualMode,
      compareMode: visualMode === "photo" ? s.compareMode : false,
      cameraNonce: s.cameraNonce + 1,
      cameraPreset:
        visualMode !== "photo" && s.cameraPreset === "bay"
          ? "hero"
          : visualMode === "photo" && s.appView === "bay"
            ? "bay"
            : s.cameraPreset,
    })),
  setAppView: (appView) =>
    set((s) => ({
      appView,
      cameraPreset: appView === "bay" ? (s.visualMode === "photo" ? "bay" : "hero") : appView === "engine" ? "hero" : s.cameraPreset,
      cameraNonce: appView === "bay" || appView === "engine" ? s.cameraNonce + 1 : s.cameraNonce,
    })),
  setCompareMode: (compareMode) =>
    set((s) => ({
      compareMode: s.visualMode === "photo" ? compareMode : false,
      cameraPreset: compareMode && s.visualMode === "photo" ? (s.appView === "bay" ? "bay" : "hero") : s.cameraPreset,
      cameraNonce: compareMode ? s.cameraNonce + 1 : s.cameraNonce,
    })),
  setVinDraft: (vinDraft) => set({ vinDraft }),
  setVinOpen: (vinOpen) => set({ vinOpen }),
  setWebgl: (webgl) => set({ webgl }),
}));

export function selectedComponent(): EngineComponent | null {
  const id = useExplorer.getState().selectedId;
  return id ? (componentById[id] ?? null) : null;
}
