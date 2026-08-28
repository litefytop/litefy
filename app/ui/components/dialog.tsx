"use client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { type ClassNameValue, cn } from "@/lib";

export type DialogProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  closeTrigger?: React.ReactNode;
};

export function Dialog({
  ref,
  className,
  children,
  open,
  onOpenChange,
  closeTrigger,

  ...props
}: DialogProps) {
  const _ref = React.useRef<HTMLDialogElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = _ref.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);

    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !dialog.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !dialog.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  React.useEffect(() => {
    const dialog = _ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  const handleNativeClose = () => {
    onOpenChange?.(false);
  };



  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onOpenChange?.(false);
  };

  const setRefs = (element: HTMLDialogElement | null) => {
    _ref.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  return (
    <dialog
      {...props}
      ref={setRefs}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClose={handleNativeClose}
 
      className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-0",
        "rounded-lg border bg-background p-6 shadow-lg text-foreground",
        "backdrop:bg-muted/50",
        className,
      )}
    >
      {closeTrigger ?? (
        <button
          type="button"
          onClick={() => onOpenChange?.(false)}
          className={
            "absolute right-4 top-4 h-6 w-8 rounded-md border text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-muted-foreground/20 select-none"
          }
          aria-label="Close (ESC)"
        >
          ESC
        </button>
      )}
      {children}
    </dialog>
  );
}

type DialogCommandOptions = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  props?: DialogProps;
};

function renderCommandDialog(options: DialogCommandOptions) {
  let container: HTMLDivElement | null = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const destroy = () => {
    if (!container) return;
    root.unmount();
    container.remove();
    container = null;
  };

  function CommandDialog() {
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
      if (!open) {
        const timer = setTimeout(destroy, 100);
        return () => clearTimeout(timer);
      }
    }, [open]);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="min-w-70 max-w-md">
          {options.title && <h3 className="text-lg font-semibold mb-3">{options.title}</h3>}
          <div>{options.children}</div>
        </div>
      </Dialog>
    );
  }

  root.render(<CommandDialog />);
}

export const dialog = {
  success: (opts: DialogCommandOptions) => renderCommandDialog(opts),
  error: (opts: DialogCommandOptions) => renderCommandDialog(opts),
  warning: (opts: DialogCommandOptions) => renderCommandDialog(opts),
  info: (opts: DialogCommandOptions) => renderCommandDialog(opts),
};
