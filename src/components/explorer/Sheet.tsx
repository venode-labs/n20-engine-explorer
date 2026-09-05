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
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[82vh] flex-col rounded-t-xl border-t border-border bg-surface outline-none">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong" />
          <div className="flex items-center justify-between px-2">
            <Drawer.Title className="px-2 text-sm font-medium text-fg">{title}</Drawer.Title>
            <button type="button" className={iconBtn} aria-label="Close" onClick={() => onOpenChange(false)}>
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
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Drawer.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,20.5rem)] flex-col border-r border-border bg-surface outline-none">
          <div className="flex items-center justify-between px-2 pt-[env(safe-area-inset-top)]">
            <Drawer.Title className="px-2 text-sm font-medium text-fg">{title}</Drawer.Title>
            <button type="button" className={iconBtn} aria-label="Close" onClick={() => onOpenChange(false)}>
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
