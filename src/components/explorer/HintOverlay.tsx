import { useEffect, useState } from "react";
import { useExplorer } from "@/store/explorer";

const KEY = "viscerra-hint-dismissed-v2";

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
    const t = window.setTimeout(() => dismiss(), 6500);
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
      ? "Drag to inspect · Tap a marked region · Pinch or scroll to zoom"
      : "Drag to orbit · Tap a component · Pinch or scroll to zoom";

  return (
    <button
      type="button"
      onClick={dismiss}
      className="pointer-events-auto max-w-[calc(100vw-2rem)] rounded-[4px] border border-border bg-surface/92 px-3 py-2 text-[11px] leading-snug tracking-[0.025em] text-muted shadow-hud backdrop-blur-md hover:text-fg sm:px-4 sm:text-xs"
      aria-label={`${copy}. Dismiss hint.`}
    >
      {copy}
    </button>
  );
}
