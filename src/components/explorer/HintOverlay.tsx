import { useEffect, useState } from "react";
import { useExplorer } from "@/store/explorer";

const KEY = "viscerra-hint-dismissed-v3";

export function HintOverlay() {
  const [show, setShow] = useState(false);
  const visualMode = useExplorer((s) => s.visualMode);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }
    setShow(true);
    const t = window.setTimeout(() => dismiss(), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  const copy =
    visualMode === "photo"
      ? "Drag to inspect · Select a marked region · Pinch or scroll to zoom · Photo is the source"
      : "Drag to orbit · Select a component · Pinch or scroll to zoom · Schematic view";

  return (
    <button
      type="button"
      onClick={dismiss}
      className="pointer-events-auto hidden max-w-[calc(100vw-2rem)] rounded-[4px] border border-border bg-surface/92 px-3 py-1.5 text-xs leading-snug text-muted shadow-hud backdrop-blur-md hover:text-fg sm:block"
      aria-label={`${copy}. Dismiss hint.`}
    >
      {copy}
    </button>
  );
}
