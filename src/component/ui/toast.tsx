"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import {
  CircleCheckIcon,
  CircleInfoIcon,
  TriangleAlertIcon,
  XIcon,
  SpinIcon,
} from "./icons";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type CloseEvent = {
  type: "auto" | "manual" | "complete";
  id?: string | number;
};

export type ToastItemProps = React.ComponentProps<"div"> & {
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
  itemProps?: {
    leading?: React.ComponentProps<"div">;
    content?: React.ComponentProps<"div">;
    actions?: React.ComponentProps<"div">;
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

const useToastStore = () => {
  return useSyncExternalStore(
    toastObserver.subscribe,
    () => toastObserver.getToasts(),
    () => [],
  );
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CircleCheckIcon className="size-4 text-green-500" />,
  error: <XIcon className="size-4 text-destructive" />,
  warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
  info: <CircleInfoIcon className="size-4" />,
  loading: <SpinIcon className="size-4 animate-spin" />,
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
  itemProps,
  className,
  ...restProps
}: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const isInitialMount = React.useRef(true);

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
    const d = duration ?? 3000;
    if (type === "loading" || d === Infinity || isExpanded) {
      return;
    }

    const timerDuration = isInitialMount.current ? d : 1000;
    isInitialMount.current = false;

    const timer = setTimeout(() => {
      handleDismiss("auto");
    }, timerDuration);

    return () => clearTimeout(timer);
  }, [handleDismiss, isExpanded, type, duration]);

  const icon = customIcon ?? toastIcons[type || "success"];

  return (
    <div
      {...restProps}
      data-expanded={isExpanded}
      data-exiting={isExiting}
      className={cn(
        "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-lg border p-4 shadow-lg text-popover-foreground bg-popover",
        "data-[expanded=true]:scale-100",
        "data-[exiting=true]:animate-out data-[exiting=true]:slide-out-to-top data-[exiting=true]:duration-300",
        "transition-all duration-400",
        className,
      )}
    >
      {icon && (
        <div
          {...itemProps?.leading}
          className={cn("shrink-0", itemProps?.leading?.className)}
        >
          {icon}
        </div>
      )}

      <div
        {...itemProps?.content}
        className={cn("flex-1 min-w-0", itemProps?.content?.className)}
      >
        <div className="font-medium">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>
      {actions && (
        <div
          {...itemProps?.actions}
          className={cn("flex gap-2", itemProps?.actions?.className)}
        >
          {actions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.(handleDismiss);
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "h-8 px-3 py-1",
                "hover:bg-accent hover:text-accent-foreground",
                action.className,
              )}
            >
              {action.children}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

export interface ToastContainerProps extends Omit<
  React.ComponentProps<"div">,
  "className"
> {
  position?: ToastPosition;
  visibleToasts?: number;
  className?: ClassNameValue;
}

function ToastContainer({
  position = "top-right",
  visibleToasts = 3,
  className,
  ...props
}: ToastContainerProps) {
  const toasts = useToastStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTimeout, setExpandedTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const filteredToasts = toasts.slice(-visibleToasts);
  const yPosition = position.startsWith("top") ? "top" : "bottom";

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

  if (filteredToasts.length === 0) {
    return null;
  }

  return (
    <div
      {...props}
      data-expanded={isExpanded}
      data-y-position={yPosition}
      className={cn(
        "fixed z-100 w-full max-w-[420px]",
        positionClasses[position],
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
      role="region"
      aria-label="Notifications"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {filteredToasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} isExpanded={isExpanded} />
      ))}
    </div>
  );
}

/**
 * Toaster static methods
 * 
 * @example
 * // 1. Initialize in root component (once)
 * ```tsx
 * import { Toaster } from "@/component";
 * 
 * function App() {
 *   return (
 *     <div>
 *       <Toaster position="top-center" />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * // 2. Use in any component
 * ```tsx
 * Toaster.success({ title: "Success" });
 * Toaster.error({ title: "Error" });
 * Toaster.warning({ title: "Warning" });
 * Toaster.info({ title: "Info" });
 * Toaster.loading({ title: "Loading..." });
 * ```
 * 
 * @remarks
 * **Important:**
 * - `Toaster` component should be initialized only **once** in the root component
 * - `position` is a global configuration, **do not** declare multiple positions
 * - Example: Declaring both `<Toaster position="top-center" />` and `<Toaster position="top-right" />` will cause each toast to appear twice
 * - Design philosophy: Fixed toast position to avoid distracting users
 */
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

  dismiss: (id?: string) => {
    if (id !== undefined) {
      const toasts = toastObserver.getToasts();
      const toast = toasts.find((t) => String(t.id) === String(id));
      if (toast?.onClose) {
        toast.onClose({ type: "manual", id });
      }
      toastObserver.removeToast(id);
    } else {
      const toasts = toastObserver.getToasts();
      toasts.forEach((t) => {
        if (t?.onClose) {
          t.onClose({ type: "manual", id: t.id });
        }
        toastObserver.removeToast(t.id!);
      });
    }
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
      toastObserver.removeToast(loadingId);
      const message =
        typeof data.success === "function"
          ? data.success(response)
          : data.success;
      toastObserver.addToast({
        title: message,
        type: "success",
      } as ToastItemProps);
    })
    .catch((error) => {
      toastObserver.removeToast(loadingId);
      const message =
        typeof data.error === "function" ? data.error(error) : data.error;
      toastObserver.addToast({
        title: message,
        type: "error",
      } as ToastItemProps);
    });
}

export { Toaster };
