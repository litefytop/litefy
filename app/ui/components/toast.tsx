"use client";

import { CircleCheck, CircleHelp, Loader2, TriangleAlert, X } from "lucide-react";
import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { type ClassNameValue, cn } from "..";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type CloseEvent = {
  type: "auto" | "manual" | "complete";
  id?: string | number;
};

export interface ToastRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastRoot({ className, ...props }: ToastRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-lg border p-4 shadow-lg text-foreground bg-background",
        "data-[expanded=true]:scale-100",
        "data-[exiting=true]:animate-out data-[exiting=true]:slide-out-to-top data-[exiting=true]:duration-300",
        "transition-all duration-400",
        className,
      )}
    />
  );
}

export interface ToastIconProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastIcon({ className, ...props }: ToastIconProps) {
  return <div {...props} className={cn("shrink-0", className)} />;
}

export interface ToastContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastContent({ className, ...props }: ToastContentProps) {
  return <div {...props} className={cn("flex-1", className)} />;
}

export interface ToastTitleProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <div {...props} className={cn("font-medium", className)} />;
}

export interface ToastDescriptionProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return <div {...props} className={cn("text-sm text-muted-foreground mt-1", className)} />;
}

export interface ToastActionsProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ToastActions({ className, ...props }: ToastActionsProps) {
  return <div {...props} className={cn("flex gap-2", className)} />;
}

export interface ToastActionProps extends Omit<
  React.ComponentProps<"button">,
  "className" | "type"
> {
  className?: ClassNameValue;
}

export function ToastAction({ className, ...props }: ToastActionProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "disabled:pointer-events-none disabled:opacity-50",
        "h-8 px-3 py-1",
        "hover:bg-primary-accent hover:text-primary-foreground",
        className,
      )}
    />
  );
}

export type ToastItemProps = Omit<React.ComponentProps<"div">, "className" | "style"> & {
  id?: string | number;
  type?: ToastType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
  onClose?: (event: CloseEvent) => void;
  actions?: Array<{
    children: React.ReactNode;
    onClick?: (dismiss: () => void) => void;
    className?: ClassNameValue;
  }>;
  isExpanded?: boolean;
  classNames?: {
    root?: ClassNameValue;
    icon?: ClassNameValue;
    content?: ClassNameValue;
    title?: ClassNameValue;
    description?: ClassNameValue;
    actions?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
    icon?: React.CSSProperties;
    content?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    actions?: React.CSSProperties;
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

  getToasts = () => this.toasts;
}

const toastObserver = new ToastObserver();

const dismissHandlers = new Map<string | number, () => void>();

const removeWithExit = (id: string | number) => {
  const handler = dismissHandlers.get(id);
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
  return useSyncExternalStore(
    toastObserver.subscribe,
    () => toastObserver.getToasts(),
    () => emptyToasts,
  );
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CircleCheck className="size-4 text-green-500" />,
  error: <X className="size-4 text-danger" />,
  warning: <TriangleAlert className="size-4 text-amber-400" />,
  info: <CircleHelp className="size-4" />,
  loading: <Loader2 className="size-4 animate-spin" />,
};

function ToastItem({
  isExpanded = false,
  id,
  type,
  duration,
  onClose,
  icon: customIcon,
  title,
  description,
  actions,
  classNames,
  styles,
  ...restProps
}: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const remainingRef = React.useRef<number | undefined>(undefined);

  const handleDismiss = useCallback(
    (closeType: "auto" | "manual" = "manual") => {
      setIsExiting(true);
      onClose?.({ type: closeType, id });

      setTimeout(() => {
        onClose?.({ type: "complete", id });
        toastObserver.removeToast(id!);
      }, 300);
    },
    [id, onClose],
  );

  useEffect(() => {
    const d = duration ?? 5000;
    if (type === "loading" || d === Infinity || isExpanded) {
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
  }, [handleDismiss, isExpanded, type, duration]);

  useEffect(() => {
    if (id === undefined) return;
    dismissHandlers.set(id, () => handleDismiss("manual"));
    return () => {
      dismissHandlers.delete(id);
    };
  }, [handleDismiss, id]);

  const icon = customIcon ?? toastIcons[type || "success"];

  return (
    <ToastRoot
      {...restProps}
      data-expanded={isExpanded}
      data-exiting={isExiting}
      className={classNames?.root}
      style={styles?.root}
    >
      {icon && (
        <ToastIcon className={classNames?.icon} style={styles?.icon}>
          {icon}
        </ToastIcon>
      )}
      <ToastContent className={classNames?.content} style={styles?.content}>
        <ToastTitle className={classNames?.title} style={styles?.title}>
          {title}
        </ToastTitle>
        {description && (
          <ToastDescription className={classNames?.description} style={styles?.description}>
            {description}
          </ToastDescription>
        )}
      </ToastContent>
      {actions && (
        <ToastActions className={classNames?.actions} style={styles?.actions}>
          {actions.map((action, idx) => (
            <ToastAction
              key={idx}
              className={action.className}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.(handleDismiss);
              }}
            >
              {action.children}
            </ToastAction>
          ))}
        </ToastActions>
      )}
    </ToastRoot>
  );
}

export interface ToastContainerProps extends Omit<React.ComponentProps<"div">, "className"> {
  visibleToasts?: number;
  className?: ClassNameValue;
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

  const filteredToasts = toasts.slice(-visibleToasts);

  React.useEffect(() => {
    if (toasts.length > prevCount.current) {
      setIsExpanded(false);
      setExpandedTimeout((current) => {
        if (current) clearTimeout(current);
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

  if (!isHost || filteredToasts.length === 0) {
    return null;
  }

  return (
    <section
      {...props}
      data-expanded={isExpanded}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-100 w-full max-w-105",
        !isExpanded && "*:absolute *:left-0 *:right-0",
        isExpanded && "flex flex-col gap-4",
        "data-[expanded=false]:[&>*:nth-child(1)]:translate-y-0",
        "data-[expanded=false]:[&>*:nth-child(2)]:translate-y-2",
        "data-[expanded=false]:[&>*:nth-child(3)]:translate-y-4",
        "data-[expanded=false]:[&>*:nth-child(n+4)]:translate-y-6",
        "data-[expanded=false]:[&>*:nth-child(1)]:scale-80",
        "data-[expanded=false]:[&>*:nth-child(2)]:scale-85",
        "data-[expanded=false]:[&>*:nth-child(3)]:scale-90",
        "data-[expanded=false]:[&>*:nth-child(n+4)]:scale-100",
        className,
      )}
      aria-label="Notifications"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {filteredToasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} isExpanded={isExpanded} />
      ))}
    </section>
  );
}

const Toaster = Object.assign(ToastContainer, {
  success: (options: ToastItemProps) => {
    return toastObserver.addToast({ ...options, type: "success" });
  },

  error: (options: ToastItemProps) => {
    return toastObserver.addToast({ ...options, type: "error" });
  },

  warning: (options: ToastItemProps) => {
    return toastObserver.addToast({ ...options, type: "warning" });
  },

  info: (options: ToastItemProps) => {
    return toastObserver.addToast({ ...options, type: "info" });
  },

  loading: (options: ToastItemProps) => {
    return toastObserver.addToast({ ...options, type: "loading" });
  },

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
  success: React.ReactNode | ((data: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
};

function promise<T>(promise: () => Promise<T>, data: PromiseData<T>) {
  const loadingId = toastObserver.addToast({
    title: data.loading,
    type: "loading",
  } as ToastItemProps);

  promise()
    .then((response) => {
      removeWithExit(loadingId);
      const message = typeof data.success === "function" ? data.success(response) : data.success;
      toastObserver.addToast({
        title: message,
        type: "success",
      } as ToastItemProps);
    })
    .catch((error) => {
      removeWithExit(loadingId);
      const message = typeof data.error === "function" ? data.error(error) : data.error;
      toastObserver.addToast({
        title: message,
        type: "error",
      } as ToastItemProps);
    });
}

export { Toaster };
