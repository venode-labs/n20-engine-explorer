import { useEffect, useState } from "react";

const KEY = "viscerra-hint-dismissed-v1";

export function HintOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }
    setShow(true);
    const t = window.setTimeout(() => dismiss(), 7000);
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

  return (
    <button
      type="button"
      onClick={dismiss}
      className="pointer-events-auto rounded-[4px] border border-border bg-surface/90 px-4 py-2 text-xs tracking-wide text-muted shadow-hud backdrop-blur-md hover:text-fg"
    >
      Drag to look · Click a part · Photo is the real engine
    </button>
  );
}
