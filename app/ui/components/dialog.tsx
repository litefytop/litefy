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
    return <dialog {...props} className={cn(className)}></dialog>;
}
export type DialogCloseProps = Omit<React.ComponentProps<"button">, "className"> & {
    className?: ClassNameValue;
};
export function DialogClose({ className, ...props }: DialogCloseProps) {
    return (<button type="button" {...props} data-slot="dialog-close" className={cn(className)}/>);
}
export type DialogContentProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: ClassNameValue;
};
export function DialogContent({ className, ...props }: DialogContentProps) {
    return (<div {...props} data-slot="dialog-content" className={cn(className)}/>);
}
export interface DialogProps extends Omit<DialogContentProps, "className" | "styles" | "title"> {
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
export function Dialog({ className, style, classNames, styles, title, children, open, onOpenChange, onBackdropClick, ...props }: DialogProps) {
    const ref = React.useRef<HTMLDialogElement>(null);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open)
            return;
        trapTabKey(e, ref.current);
    };
    React.useEffect(() => {
        const dialog = ref.current;
        if (!dialog)
            return;
        if (open) {
            if (!dialog.open)
                dialog.showModal();
        }
        else {
            if (dialog.open)
                dialog.close();
        }
    }, [open]);
    const handleNativeClose = () => {
        onOpenChange?.(false);
    };
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        onOpenChange?.(false);
    };
    const renderCloseButton = () => (<DialogClose data-inline="true" className={classNames?.close} style={styles?.close} aria-label="Close (ESC)" onClick={() => onOpenChange?.(false)}>
      ESC
    </DialogClose>);
    return (<DialogRoot ref={ref} data-open={open || undefined} onKeyDown={handleKeyDown} onCancel={handleCancel} onClose={handleNativeClose} onClick={(e) => {
            if (e.target === e.currentTarget)
                onBackdropClick?.(e);
        }} className={cn("litefy-dialog", className)} style={style}>
      <DialogContent {...props} style={styles?.content} className={classNames?.content}>
        <div data-slot="dialog-header">
          {title != null && (<h3 data-slot="dialog-title">{title}</h3>)}
          {renderCloseButton()}
        </div>
        {children}
      </DialogContent>
    </DialogRoot>);
}
export type DialogCommandType = "success" | "error" | "warning" | "info";
type DialogCommandOptions = {
    type?: DialogCommandType;
    title?: React.ReactNode;
    children?: React.ReactNode;
    props?: DialogProps;
};
const commandIcons: Record<DialogCommandType, React.ReactNode> = {
    success: <CircleCheck data-dialog-icon="success"/>,
    error: <X data-dialog-icon="error"/>,
    warning: <TriangleAlert data-dialog-icon="warning"/>,
    info: <CircleHelp data-dialog-icon="info"/>,
};
function renderCommandDialog(options: DialogCommandOptions) {
    let container: HTMLDivElement | null = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const destroy = () => {
        if (!container)
            return;
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
        const titleNode = options.title ? (options.type ? (<span data-slot="dialog-title-icon">
          {commandIcons[options.type]}
          {options.title}
        </span>) : (options.title)) : undefined;
        return (<Dialog open={open} onOpenChange={setOpen} {...options.props} title={titleNode}>
        <div>{options.children}</div>
      </Dialog>);
    }
    root.render(<CommandDialog />);
}
export const dialog = {
    success: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "success" }),
    error: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "error" }),
    warning: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "warning" }),
    info: (opts: Omit<DialogCommandOptions, "type">) => renderCommandDialog({ ...opts, type: "info" }),
};
