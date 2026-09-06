import { useEffect, useState } from "react";

const KEY = "viscerra-hint-dismissed-v2";

export function HintOverlay() {
  const [show, setShow] = useState(false);

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

  return (
    <button
      type="button"
      onClick={dismiss}
      className="pointer-events-auto hidden rounded-[4px] border border-border bg-surface/92 px-3 py-1.5 text-xs text-muted shadow-hud backdrop-blur-md hover:text-fg sm:block"
      aria-label="Dismiss interaction hint"
    >
      Drag to inspect · select a part · Photo is the source
    </button>
  );
}
