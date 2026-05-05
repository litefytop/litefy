"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { Button, ButtonProps } from "./button";
import { Spin } from "./spin";
import {
  CircleCheckIcon,
  CircleInfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "./icons";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastItemProps = React.ComponentProps<"div"> & {
  id?: string | number;
  type?: ToastType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
  onDismiss?: (toast: ToastItemProps) => void;
  onAutoClose?: (toast: ToastItemProps) => void;
  actions?: Array<
    Omit<ButtonProps, "onClick"> & {
      onClick?: (dismiss: () => void) => void;
    }
  >;
  index?: number;
  isExpanded?: boolean;
  yPosition?: "top" | "bottom";
  onRemove?: (id: string | number) => void;
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
  loading: <Spin className="size-4 animate-spin" />,
};

function ToastItem(props: ToastItemProps) {
  const {
    index = 0,
    isExpanded = false,
    yPosition = "bottom",
    onRemove,
  } = props;
  const [isExiting, setIsExiting] = useState(false);
  const [exitIndex, setExitIndex] = useState(index);

  const toastsAfter = isExiting ? exitIndex : index;
  const lift = yPosition === "top" ? 1 : -1;

  const handleDismiss = useCallback(() => {
    setExitIndex(index);
    setIsExiting(true);
    setTimeout(() => {
      onRemove?.(props.id!);
    }, 300);
  }, [onRemove, props.id, index]);

  useEffect(() => {
    const duration = props.duration ?? 3000;
    if (props.type === "loading" || duration === Infinity || isExpanded) {
      return;
    }

    const timer = setTimeout(() => {
      handleDismiss();
      props.onAutoClose?.(props);
    }, duration);

    return () => clearTimeout(timer);
  }, [handleDismiss, props, isExpanded]);

  const icon = props.icon ?? toastIcons[props.type||"success"];

  return (
    <div
      {...props}
      style={{
        zIndex: 1000 + index,
        transform: `translateY(${toastsAfter * (isExpanded ? 80 : 10) * lift}px) scale(${isExpanded ? 1 : Math.max(1 - toastsAfter * 0.02, 0.8)})`,
        transition: "transform 400ms",
        ...props.style,
      }}
      className={cn(
        "pointer-events-auto absolute left-0 right-0 flex w-full items-center justify-between gap-3 rounded-lg border p-4 shadow-lg text-popover-foreground bg-popover mb-2",
        isExiting && "animate-out slide-out-to-top duration-300",
        props.className,
      )}
    >
      
        {icon && (
            <div
              {...props.itemProps?.leading}
              className={cn("shrink-0", props.itemProps?.leading?.className)}
            >
              {icon}
            </div>
          )}

          <div
            {...props.itemProps?.content}
            className={cn("flex-1 min-w-0", props.itemProps?.content?.className)}
          >
            <div className="font-medium">{props.title}</div>
            {props.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {props.description}
              </div>
            )}
          </div>
          {props.actions?.length && (
            <div
              {...props.itemProps?.actions}
              className={cn("flex gap-2 mt-2", props.itemProps?.actions?.className)}
            >
              {props.actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant ?? "text"}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.(handleDismiss);
                  }}
                >
                  {action.children}
                </Button>
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
  const [expandedTimeout, setExpandedTimeout] = useState<NodeJS.Timeout | null>(null);

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

  const handleDismiss = (id: string | number) => {
    const toast = toasts.find((t) => t.id === id);
    if (toast?.onDismiss) {
      toast.onDismiss(toast);
    }
    toastObserver.removeToast(id);
  };

  return (
    <div
      {...props}
      className={cn(
        "fixed z-100 flex flex-col w-full max-w-[420px] pointer-events-none",
        positionClasses[position],
        "text-popover-foreground bg-popover",
        className,
      )}
      role="region"
      aria-label="Notifications"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {filteredToasts.map((toast, index) => {
        return (
          <ToastItem
            key={toast.id}
            {...toast}
            index={index}
            isExpanded={isExpanded}
            yPosition={yPosition}
            onRemove={handleDismiss}
          />
        );
      })}
    </div>
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

  dismiss: (id?: string) => {
    if (id !== undefined) {
      toastObserver.removeToast(id);
    } else {
      const toasts = toastObserver.getToasts();
      toasts.forEach((t) => toastObserver.removeToast(t.id!));
    }
  },

  promise,
});

type PromiseData<T> = {
  loading: React.ReactNode;
  success: React.ReactNode | ((data: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
};

function promise<T>(
  promise: () => Promise<T>,
  data: PromiseData<T>
) {
  const loadingId = toastObserver.addToast({ title: data.loading, type: "loading" } as ToastItemProps);

  promise()
    .then((response) => {
      toastObserver.removeToast(loadingId);
      const message = typeof data.success === "function" ? data.success(response) : data.success;
      toastObserver.addToast({ title: message, type: "success" } as ToastItemProps);
    })
    .catch((error) => {
      toastObserver.removeToast(loadingId);
      const message = typeof data.error === "function" ? data.error(error) : data.error;
      toastObserver.addToast({ title: message, type: "error" } as ToastItemProps);
    });
}

export { Toaster };
