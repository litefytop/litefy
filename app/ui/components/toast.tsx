"use client";
import { CircleCheck, CircleHelp, Loader2, TriangleAlert, X } from "./icons";
import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSpin } from "../utils/use-spin";
import { getSchemeDurationMs } from "../utils/scheme-duration";
export type ToastType = "success" | "error" | "warning" | "info";
export type CloseEvent = {
    type: "auto" | "manual" | "complete";
    id?: string | number;
};
export interface ToastRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ToastRoot(props: ToastRootProps) {
    return (<div {...props}/>);
}
export interface ToastIconProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ToastIcon(props: ToastIconProps) {
    return <div {...props}/>;
}
export interface ToastContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ToastContent(props: ToastContentProps) {
    return <div {...props}/>;
}
export interface ToastTitleProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ToastTitle(props: ToastTitleProps) {
    return <div {...props}/>;
}
export interface ToastDescriptionProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ToastDescription(props: ToastDescriptionProps) {
    return <div {...props}/>;
}
export interface ToastCloseProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    className?: string;
}
export function ToastClose({ className, children, ...props }: ToastCloseProps) {
    return (<button aria-label="Dismiss notification" {...props} type="button" className={className}>
      {children ?? <X/>}
    </button>);
}
export type ToastItemProps = Omit<React.ComponentProps<"div">, "className" | "style" | "title"> & {
    id?: string | number;
    type?: ToastType;
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    duration?: number;
    closable?: boolean;

    onClose?: (event: CloseEvent) => void;
    isExpanded?: boolean;
    classNames?: {
        root?: string;
        surface?: string;
        icon?: string;
        content?: string;
        title?: string;
        description?: string;
        close?: string;
    };
    styles?: {
        surface?: React.CSSProperties;
        icon?: React.CSSProperties;
        content?: React.CSSProperties;
        title?: React.CSSProperties;
        description?: React.CSSProperties;
        close?: React.CSSProperties;
    };
};
let toastsCounter = 1;
class ToastObserver {
    private toasts: ToastItemProps[] = [];
    private subscribers: Set<() => void> = new Set();
    subscribe = (subscriber: () => void) => {
        this.subscribers.add(subscriber);
        return () => {
            this.subscribers.delete(subscriber);
        };
    };
    private publish = () => {
        this.subscribers.forEach((subscriber) => subscriber());
    };
    addToast = (toast: ToastItemProps) => {
        const id = toastsCounter++;
        this.toasts = [...this.toasts, { ...toast, id: String(id) }];
        this.publish();
        return id;
    };
    removeToast = (id: string | number) => {
        this.toasts = this.toasts.filter((t) => String(t.id) !== String(id));
        this.publish();
        if (this.toasts.length === 0) {
            toastsCounter = 1;
        }
    };
    updateToast = (id: string | number, patch: Partial<ToastItemProps>) => {
        this.toasts = this.toasts.map((t) => String(t.id) === String(id) ? { ...t, ...patch } : t);
        this.publish();
    };
    getToasts = () => this.toasts;
}
const toastObserver = new ToastObserver();
const dismissHandlers = new Map<string | number, () => void>();
const removeWithExit = (id: string | number) => {
    const handler = dismissHandlers.get(String(id));
    if (handler) {
        handler();
        return;
    }
    const toast = toastObserver.getToasts().find((t) => String(t.id) === String(id));
    toast?.onClose?.({ type: "manual", id });
    toast?.onClose?.({ type: "complete", id });
    toastObserver.removeToast(id);
};
const emptyToasts: ToastItemProps[] = [];
const useToastStore = () => {
    return useSyncExternalStore(toastObserver.subscribe, () => toastObserver.getToasts(), () => emptyToasts);
};
function ToastSpinner() {
    const ref = useSpin<SVGSVGElement>();
    return <Loader2 ref={ref}/>;
}
const toastIcons: Record<ToastType, React.ReactNode> = {
    success: <CircleCheck/>,
    error: <X/>,
    warning: <TriangleAlert/>,
    info: <CircleHelp/>,
};
const EXIT_DURATION_HOOK = "--duration-lg";
function ToastItem({ isExpanded = false, id, type, duration, closable, onClose, icon: customIcon, title, description, classNames, styles, ...restProps }: ToastItemProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [tapped, setTapped] = useState(false);
    const paused = isExpanded || tapped;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const exitingRef = React.useRef(false);
    const remainingRef = React.useRef<number | undefined>(undefined);
    const handleDismiss = useCallback((closeType: "auto" | "manual" = "manual") => {
        if (exitingRef.current)
            return;
        exitingRef.current = true;
        setIsExiting(true);
        onClose?.({ type: closeType, id });
        const el = rootRef.current;
        const exitMs = el ? getSchemeDurationMs(el, EXIT_DURATION_HOOK) : 0;
        if (el && exitMs > 0) {
            const gap = Number.parseFloat(getComputedStyle(el.parentElement ?? el).rowGap) || 0;
            el.style.overflow = "hidden";
            el.animate([
                { height: `${el.offsetHeight}px`, marginBottom: "0px", opacity: "1" },
                { height: "0px", marginBottom: `${-gap}px`, opacity: "0" },
            ], { duration: exitMs, easing: "ease-out", fill: "forwards" });
        }
        setTimeout(() => {
            onClose?.({ type: "complete", id });
            toastObserver.removeToast(id!);
        }, exitMs);
    }, [id, onClose]);
    useEffect(() => {
        const d = duration ?? 5000;
        if (d === Infinity || paused) {
            return;
        }
        if (remainingRef.current === undefined) {
            remainingRef.current = d;
        }
        const startedAt = Date.now();
        const timer = setTimeout(() => {
            handleDismiss("auto");
        }, remainingRef.current);
        return () => {
            remainingRef.current = Math.max(0, (remainingRef.current ?? d) - (Date.now() - startedAt));
            clearTimeout(timer);
        };
    }, [handleDismiss, paused, duration]);
    useEffect(() => {
        if (id === undefined)
            return;
        dismissHandlers.set(id, () => handleDismiss("manual"));
        return () => {
            dismissHandlers.delete(id);
        };
    }, [handleDismiss, id]);
    const icon = customIcon ?? toastIcons[type || "success"];
    return (<ToastRoot {...restProps} ref={rootRef} role="status" data-type={type} data-expanded={isExpanded} data-tapped={tapped || undefined} data-exiting={isExiting} onClick={() => setTapped((current) => !current)} className={classNames?.root}>
      <span aria-hidden data-surface="" data-type={type} className={classNames?.surface} style={styles?.surface}/>
      {icon && (<ToastIcon data-type={type} className={classNames?.icon} style={styles?.icon}>
          {icon}
        </ToastIcon>)}
      <ToastContent className={classNames?.content} style={styles?.content}>
        <ToastTitle className={classNames?.title} style={styles?.title}>
          {title}
        </ToastTitle>
        {description && (<ToastDescription className={classNames?.description} style={styles?.description}>
            {description}
          </ToastDescription>)}
      </ToastContent>
      {closable && (<ToastClose className={classNames?.close} style={styles?.close} onClick={(e) => {
                e.stopPropagation();
                handleDismiss("manual");
            }}/>)}
    </ToastRoot>);
}
export interface ToastContainerProps extends Omit<React.ComponentProps<"div">, "className"> {
    visibleToasts?: number;

    className?: string;
}
let hostOwnerId: symbol | null = null;
const hostListeners = new Set<() => void>();
function claimHost(id: symbol) {
    if (hostOwnerId === null) {
        hostOwnerId = id;
        hostListeners.forEach((listener) => listener());
    }
}
function releaseHost(id: symbol) {
    if (hostOwnerId === id) {
        hostOwnerId = null;
        hostListeners.forEach((listener) => listener());
    }
}
function useHostClaim() {
    const idRef = React.useRef(Symbol("toaster-host"));
    const [isHost, setIsHost] = React.useState(false);
    React.useEffect(() => {
        const id = idRef.current;
        claimHost(id);
        const sync = () => setIsHost(hostOwnerId === id);
        sync();
        hostListeners.add(sync);
        return () => {
            releaseHost(id);
            hostListeners.delete(sync);
        };
    }, []);
    return isHost;
}
function ToastContainer({ visibleToasts = 3, className, ...props }: ToastContainerProps) {
    const isHost = useHostClaim();
    const toasts = useToastStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedTimeout, setExpandedTimeout] = useState<NodeJS.Timeout | null>(null);
    const prevCount = React.useRef(0);
    const viewportRef = React.useRef<HTMLElement>(null);
    const filteredToasts = toasts.slice(-visibleToasts);
    React.useEffect(() => {
        const el = viewportRef.current;
        if (!el || filteredToasts.length === 0)
            return;
        if (typeof el.showPopover === "function") {
            try {
                el.showPopover();
            }
            catch {
            }
        }
    }, [filteredToasts.length]);
    React.useEffect(() => {
        if (toasts.length > prevCount.current) {
            setIsExpanded(false);
            setExpandedTimeout((current) => {
                if (current)
                    clearTimeout(current);
                return null;
            });
        }
        prevCount.current = toasts.length;
    }, [toasts.length]);
    const handleMouseEnter = () => {
        if (expandedTimeout) {
            clearTimeout(expandedTimeout);
            setExpandedTimeout(null);
        }
        setIsExpanded(true);
    };
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsExpanded(false);
        }, 100);
        setExpandedTimeout(timeout);
    };
    const handleFocus = () => {
        if (expandedTimeout) {
            clearTimeout(expandedTimeout);
            setExpandedTimeout(null);
        }
        setIsExpanded(true);
    };
    const handleBlur = () => {
        if (expandedTimeout) {
            clearTimeout(expandedTimeout);
            setExpandedTimeout(null);
        }
        setIsExpanded(false);
    };
    if (!isHost || filteredToasts.length === 0) {
        return null;
    }
    return (<section aria-label="Notifications" {...props} ref={viewportRef} popover="manual" tabIndex={0} data-expanded={isExpanded} className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onFocus={handleFocus} onBlur={handleBlur}>
      {filteredToasts.map((toast) => (<ToastItem key={toast.id} {...toast} isExpanded={isExpanded}/>))}
    </section>);
}
type ToastMethod = (options: ToastItemProps) => string | number;
const toastMethods = Object.fromEntries((["success", "error", "warning", "info"] as ToastType[]).map((type) => [
    type,
    (options: ToastItemProps) => toastObserver.addToast({ ...options, type }),
])) as Record<ToastType, ToastMethod>;
const Toaster = Object.assign(ToastContainer, toastMethods, {
    dismiss: (id?: string | number) => {
        if (id !== undefined) {
            removeWithExit(id);
            return;
        }
        const toasts = toastObserver.getToasts();
        toasts.forEach((t) => {
            if (t.id !== undefined) {
                removeWithExit(t.id);
            }
        });
    },
    promise,
});
type PromiseData<T> = {
    loading: React.ReactNode;

    classNames?: ToastItemProps["classNames"];
    success: React.ReactNode | ((data: T) => React.ReactNode);
    error: React.ReactNode | ((error: unknown) => React.ReactNode);
};
function promise<T>(task: () => Promise<T>, data: PromiseData<T>) {
    const id = toastObserver.addToast({
        title: data.loading,
        icon: <ToastSpinner/>,
        duration: Infinity,
        classNames: data.classNames,
    });
    task()
        .then((response) => {
        const message = typeof data.success === "function" ? data.success(response) : data.success;
        toastObserver.updateToast(id, { title: message, type: "success", icon: undefined, duration: undefined });
        return undefined;
    })
        .catch((error) => {
        const message = typeof data.error === "function" ? data.error(error) : data.error;
        toastObserver.updateToast(id, { title: message, type: "error", icon: undefined, duration: undefined });
    });
}
export { Toaster };
