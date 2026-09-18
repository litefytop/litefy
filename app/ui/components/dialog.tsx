"use client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { CircleCheck, CircleHelp, TriangleAlert, X } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { trapTabKey } from "../utils/trap-tab-key";

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
        "absolute right-4 top-4 h-6 w-8 rounded-sm border text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground cursor-pointer select-none",
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
        "rounded-xl border p-6 shadow-elevated bg-surface-raised text-foreground",
        className,
      )}
    />
  );
}

export interface DialogProps
  extends Omit<DialogContentProps, "className" | "styles" | "title"> {
  open: boolean;
  title?: React.ReactNode;
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
  title,
  children,
  open,
  onOpenChange,
  onBackdropClick,
  ...props
}: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    trapTabKey(e, ref.current);
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

  const renderCloseButton = (inFlow?: boolean) => (
    <DialogClose
      className={cn(inFlow && "static shrink-0", classNames?.close)}
      style={styles?.close}
      aria-label="Close (ESC)"
      onClick={() => onOpenChange?.(false)}
    >
      ESC
    </DialogClose>
  );

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
        {title != null ? (
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="min-w-0 text-lg font-semibold">{title}</h3>
            {renderCloseButton(true)}
          </div>
        ) : (
          renderCloseButton()
        )}
        {children}
      </DialogContent>
    </DialogRoot>
  );
}

export type DialogCommandType = "success" | "error" | "warning" | "info";

type DialogCommandOptions = {
  type?: DialogCommandType;
  title?: React.ReactNode;
  children?: React.ReactNode;
  props?: DialogProps;
};

const commandIcons: Record<DialogCommandType, React.ReactNode> = {
  success: <CircleCheck className="size-5 text-success" />,
  error: <X className="size-5 text-danger" />,
  warning: <TriangleAlert className="size-5 text-warning" />,
  info: <CircleHelp className="size-5 text-info" />,
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

    const titleNode = options.title ? (
      options.type ? (
        <span className="flex items-center gap-2">
          {commandIcons[options.type]}
          {options.title}
        </span>
      ) : (
        options.title
      )
    ) : undefined;

    return (
      <Dialog open={open} onOpenChange={setOpen} {...options.props} title={titleNode}>
        <div>{options.children}</div>
      </Dialog>
    );
  }

  root.render(<CommandDialog />);
}

export const dialog = {
  success: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "success" }),
  error: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "error" }),
  warning: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "warning" }),
  info: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "info" }),
};
