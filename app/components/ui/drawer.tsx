"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

const getLockCount = (): number => {
  if (typeof window === "undefined") return 0;
  const value = document.documentElement.getAttribute("data-scroll-lock");
  if (value === null) return 0;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setLockCount = (count: number) => {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-scroll-lock", String(count));
};

let originalHtmlOverflow = "";
let originalHtmlScrollbarGutter = "";

const lockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 0) {
    const html = document.documentElement;
    originalHtmlOverflow = html.style.overflow;
    originalHtmlScrollbarGutter = html.style.scrollbarGutter;
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
  }
  setLockCount(count + 1);
};

const unlockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 1) {
    const html = document.documentElement;
    html.style.overflow = originalHtmlOverflow;
    html.style.scrollbarGutter = originalHtmlScrollbarGutter;
  }
  if (count > 0) {
    setLockCount(count - 1);
  }
};

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type DrawerProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  onClose?: () => void;
  slotProps?: {
    content?: HTMLAttrs<Omit<React.ComponentProps<"div">, "style">>;
  };
};

const placementStyles = {
  left: "left-0 top-0 bottom-0",
  right: "right-0 top-0 bottom-0",
  top: "left-0 right-0 top-0",
  bottom: "left-0 right-0 bottom-0",
};

const getInitialTransform = (placement: DrawerProps["placement"]) => {
  switch (placement) {
    case "left":
      return "translateX(-100%)";
    case "right":
      return "translateX(100%)";
    case "top":
      return "translateY(-100%)";
    case "bottom":
      return "translateY(100%)";
    default:
      return "";
  }
};

function Drawer({
  ref,
  className,
  placement = "right",
  children,
  onClose,
  slotProps,
  ...props
}: DrawerProps) {
  const _ref = React.useRef<HTMLDialogElement>(null);
  const isOpenRef = React.useRef(false);
  const [isVisible, setIsVisible] = React.useState(false);

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
      if (
        document.activeElement === first ||
        !dialog.contains(document.activeElement)
      ) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (
        document.activeElement === last ||
        !dialog.contains(document.activeElement)
      ) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const closeWithAnimation = () => {
    const dialog = _ref.current;
    if (!dialog?.open) return;
    setIsVisible(false);
  };

  React.useEffect(() => {
    const dialog = _ref.current;
    if (!dialog) return;

    const observer = new MutationObserver(() => {
      const nowOpen = dialog.hasAttribute("open");
      if (nowOpen && !isOpenRef.current) {
        lockScroll();
        isOpenRef.current = true;
        setIsVisible(true);
      } else if (!nowOpen && isOpenRef.current) {
        unlockScroll();
        isOpenRef.current = false;
        onClose?.();
      }
    });

    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

    if (dialog.hasAttribute("open")) {
      lockScroll();
      isOpenRef.current = true;
      setIsVisible(true);
    }

    return () => {
      observer.disconnect();
      if (isOpenRef.current) unlockScroll();
    };
  }, [onClose]);

  React.useEffect(() => {
    const dialog = _ref.current;
    if (!dialog) return;
    const handleTransitionEnd = () => {
      if (!isVisible && dialog.open) {
        dialog.close();
      }
    };
    dialog.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      dialog.removeEventListener("transitionend", handleTransitionEnd);
  }, [isVisible]);

  React.useEffect(() => {
    return () => {
      if (isOpenRef.current) unlockScroll();
    };
  }, []);

  const setRefs = (element: HTMLDialogElement | null) => {
    _ref.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  const transformValue = isVisible
    ? "translate(0, 0)"
    : getInitialTransform(placement);

  return (
    <dialog
      ref={setRefs}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWithAnimation();
      }}
      onCancel={(e) => {
        e.preventDefault();
        closeWithAnimation();
      }}
      className={cn("bg-transparent backdrop:bg-muted/50", className)}
      {...props}
    >
      <div
        data-orientation={
          placement === "left" || placement === "right"
            ? "vertical"
            : "horizontal"
        }
        {...slotProps?.content}
        className={cn(
          "fixed bg-background shadow-lg transition-transform duration-300 ease-out p-4 flex flex-col",
          placementStyles[placement],
          "data-[orientation=horizontal]:h-1/3 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:items-center",
          "data-[orientation=vertical]:w-1/4  data-[orientation=vertical]:h-full",
          slotProps?.content?.className,
        )}
        style={{ transform: transformValue }}
      >
        {children}
      </div>
    </dialog>
  );
}

export { Drawer };
