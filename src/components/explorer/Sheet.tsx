import type { ReactNode } from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { iconBtn } from "./chrome";

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/78 backdrop-blur-[2px]" />
        <Drawer.Content
          data-ui="bottom-sheet"
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[84vh] flex-col rounded-t-xl border-t border-border bg-surface outline-none shadow-[0_-24px_70px_rgb(0_0_0_/_0.46)]"
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong" />
          <div className="flex min-h-12 items-center justify-between gap-2 border-b border-border/70 px-3">
            <Drawer.Title className="min-w-0 truncate text-[15px] font-medium tracking-tight text-fg">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">Component details and controls.</Drawer.Description>
            <button type="button" className={iconBtn} aria-label="Close details" onClick={() => onOpenChange(false)}>
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden pb-[env(safe-area-inset-bottom)]">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function SideSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="left">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/78 backdrop-blur-[2px]" />
        <Drawer.Content
          data-ui="side-sheet"
          className="fixed inset-y-0 left-0 z-50 flex w-[min(92vw,20.5rem)] flex-col border-r border-border bg-surface outline-none shadow-[24px_0_70px_rgb(0_0_0_/_0.46)]"
        >
          <div className="flex min-h-12 items-center justify-between gap-2 border-b border-border/70 px-3 pt-[env(safe-area-inset-top)]">
            <Drawer.Title className="min-w-0 truncate text-[15px] font-medium tracking-tight text-fg">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">Browse and search engine components.</Drawer.Description>
            <button type="button" className={iconBtn} aria-label="Close catalogue" onClick={() => onOpenChange(false)}>
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
