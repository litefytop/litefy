"use client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { type ClassNameValue, cn } from "../utils/cn";

export type DialogRootProps = Omit<React.ComponentProps<"dialog">, "className"> & {
  className?: ClassNameValue;
};

export function DialogRoot({ className, ...props }: DialogRootProps) {
  return <dialog {...props} className={cn("focus:outline-none", className)} />;
}

export type DialogCloseProps = Omit<React.ComponentProps<"button">, "className"> & {
  className?: ClassNameValue;
};

export function DialogClose({ className, ...props }: DialogCloseProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "absolute right-4 top-4 h-6 w-8 rounded-sm border text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-hover select-none",
        className,
      )}
    />
  );
}

export type DialogContentProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
};

export function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <div
      {...props}
      className={cn(
        "fixed min-w-70 max-w-md",
        "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-0",
        "rounded-lg border p-6 shadow-lg bg-background text-foreground",
        className,
      )}
    />
  );
}

export interface DialogProps extends Omit<DialogContentProps, "className" | "styles"> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onBackdropClick?: (e: React.MouseEvent<HTMLDialogElement>) => void;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    content?: ClassNameValue;
    close?: ClassNameValue;
  };
  styles?: {
    content?: React.CSSProperties;
    close?: React.CSSProperties;
  };
}

export function Dialog({
  className,
  style,
  classNames,
  styles,
  children,
  open,
  onOpenChange,
  onBackdropClick,
  ...props
}: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key !== "Tab") return;
    const dialog = ref.current;
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
    const dialog = ref.current;
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

  return (
    <DialogRoot
      ref={ref}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onBackdropClick?.(e);
      }}
      className={className}
      style={style}
    >
      <DialogContent {...props} style={styles?.content} className={classNames?.content}>
        <DialogClose
          className={classNames?.close}
          style={styles?.close}
          aria-label="Close (ESC)"
          onClick={() => onOpenChange?.(false)}
        >
          ESC
        </DialogClose>
        {children}
      </DialogContent>
    </DialogRoot>
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
      <Dialog open={open} onOpenChange={setOpen} {...options.props}>
        {options.title && <h3 className="text-lg font-semibold mb-3">{options.title}</h3>}
        <div>{options.children}</div>
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
