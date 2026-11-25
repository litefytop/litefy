"use client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { CircleCheck, CircleHelp, TriangleAlert, X } from "./icons";
import { trapTabKey } from "../utils/trap-tab-key";
export type DialogRootProps = Omit<React.ComponentProps<"dialog">, "className"> & {
    className?: string;
};
export function DialogRoot(props: DialogRootProps) {
    return <dialog {...props}></dialog>;
}
export type DialogStageProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
};
export function DialogStage(props: DialogStageProps) {
    return (<div {...props}/>);
}
export type DialogCloseProps = Omit<React.ComponentProps<"button">, "className"> & {
    className?: string;
};
export function DialogClose(props: DialogCloseProps) {
    return (<button type="button" {...props}/>);
}
export type DialogContentProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
};
export function DialogContent(props: DialogContentProps) {
    return (<div {...props}/>);
}
export interface DialogProps extends Omit<DialogContentProps, "className" | "styles" | "title"> {
    open: boolean;
    title?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    onBackdropClick?: (e: React.MouseEvent<HTMLDialogElement>) => void;
    close?: "icon" | "kbd" | null;
    closeLabel?: string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        root?: string;
        stage?: string;
        content?: string;
        close?: string;
        closeIcon?: string;
        closeKey?: string;
        header?: string;
        title?: string;
        titleIcon?: string;
    };
    styles?: {
        stage?: React.CSSProperties;
        content?: React.CSSProperties;
        close?: React.CSSProperties;
        header?: React.CSSProperties;
        title?: React.CSSProperties;
        titleIcon?: React.CSSProperties;
    };
}
export function Dialog({ className, style, classNames, styles, title, children, open, onOpenChange, onBackdropClick, close, closeLabel = "Close", "aria-label": ariaLabel, ...props }: DialogProps) {
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
        else if (dialog.open)
            dialog.close();
    }, [open]);
    const handleNativeClose = () => {
        onOpenChange?.(false);
    };
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        onOpenChange?.(false);
    };
    const renderCloseButton = () => {
        if (!close)
            return null;
        return (<DialogClose data-inline="true" className={classNames?.close} style={styles?.close} aria-label={closeLabel} onClick={() => onOpenChange?.(false)}>
        {close === "icon" ? <X data-close-icon className={classNames?.closeIcon}/> : <kbd data-close-key className={classNames?.closeKey}>ESC</kbd>}
      </DialogClose>);
    };
    const showHeader = (title !== undefined && title !== null) || (close !== undefined && close !== null);
    return (<DialogRoot ref={ref} aria-label={ariaLabel} data-open={open || undefined} onKeyDown={handleKeyDown} onCancel={handleCancel} onClose={handleNativeClose} onClick={(e) => {
            if (e.target === e.currentTarget) {
                onOpenChange?.(false);
                onBackdropClick?.(e);
            }
        }} className={className || classNames?.root} style={style}>
      <DialogStage style={styles?.stage} className={classNames?.stage}>
        <DialogContent {...props} style={styles?.content} className={classNames?.content}>
          {showHeader && (<div className={classNames?.header} style={styles?.header}>
            {title !== undefined && title !== null && (<h3 className={classNames?.title} style={styles?.title}>{title}</h3>)}
            {renderCloseButton()}
          </div>)}
          {children}
        </DialogContent>
      </DialogStage>
    </DialogRoot>);
}
export type DialogCommandType = "success" | "error" | "warning" | "info";
export type DialogCommandOptions = {
    type?: DialogCommandType;
    title?: React.ReactNode;
    children?: React.ReactNode;
    props?: Omit<DialogProps, "open">;
};
const commandIcons: Record<DialogCommandType, React.ReactNode> = {
    success: <CircleCheck data-status="success"/>,
    error: <X data-status="error"/>,
    warning: <TriangleAlert data-status="warning"/>,
    info: <CircleHelp data-status="info"/>,
};
function renderCommandDialog(options: DialogCommandOptions) {
    let container: HTMLDivElement | null = document.createElement("div");
    document.body.append(container);
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
        const titleNode = options.title ? (options.type ? (<span data-status={options.type} className={options.props?.classNames?.titleIcon} style={options.props?.styles?.titleIcon}>
          {commandIcons[options.type]}
          {" "}{options.title}
        </span>) : (options.title)) : undefined;
        return (<Dialog open={open} onOpenChange={setOpen} close="icon" {...options.props} title={titleNode}>
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
