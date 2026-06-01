"use client";

import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

interface AnchorContextValue {
  activeIds: Set<string>;
  position: "left" | "right";
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

function useAnchorContext() {
  const context = useContext(AnchorContext);
  if (!context) {
    throw new Error("Anchor subcomponents must be used within Anchor");
  }
  return context;
}

type AnchorProps = Omit<React.ComponentProps<"nav">, "className"> & {
  rootMargin?: string;
  root?: Element | Document | null | React.RefObject<Element | Document | null>;
  className?: ClassNameValue;
  position?: "left" | "right";
};

export function Anchor({
  className,
  children,
  root,
  rootMargin = "0px",
  position = "right",
  ...props
}: AnchorProps) {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const activeIdsRef = useRef(activeIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMap = useRef<Map<string, Element>>(new Map());
  const linkPositionsRef = useRef<Map<string, { top: number; bottom: number }>>(new Map());

  useEffect(() => {
    activeIdsRef.current = activeIds;
  }, [activeIds]);

  const registerLinkPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    const newPositions = new Map<string, { top: number; bottom: number }>();

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) continue;
      const id = href.slice(1);
      if (!id) continue;

      const styles = getComputedStyle(link);
      const top = link.offsetTop + parseFloat(styles.paddingTop);
      const bottom = link.offsetTop + link.clientHeight - parseFloat(styles.paddingBottom);
      newPositions.set(id, { top, bottom });
    }

    linkPositionsRef.current = newPositions;
  }, []);

  const updateThumb = useCallback(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;

    if (activeIdsRef.current.size === 0) {
      thumb.style.top = "0px";
      thumb.style.height = "0px";
      return;
    }

    let upper = Number.MAX_VALUE;
    let lower = 0;
    for (const id of activeIdsRef.current) {
      const pos = linkPositionsRef.current.get(id);
      if (!pos) continue;
      upper = Math.min(upper, pos.top);
      lower = Math.max(lower, pos.bottom);
    }

    if (upper !== Number.MAX_VALUE) {
      thumb.style.top = `${upper}px`;
      thumb.style.height = `${lower - upper}px`;
    } else {
      thumb.style.top = "0px";
      thumb.style.height = "0px";
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      registerLinkPositions();
      updateThumb();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [registerLinkPositions, updateThumb]);

  useEffect(() => {
    registerLinkPositions();
    updateThumb();
  }, [children, registerLinkPositions, updateThumb]);

  useEffect(() => {
    updateThumb();
  }, [activeIds, updateThumb]);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const currentActive = activeIdsRef.current;
    const newActiveIds = new Set(currentActive);
    let changed = false;
    for (const entry of entries) {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        if (!newActiveIds.has(id)) {
          newActiveIds.add(id);
          changed = true;
        }
      } else {
        if (newActiveIds.has(id)) {
          newActiveIds.delete(id);
          changed = true;
        }
      }
    }
    if (changed) setActiveIds(newActiveIds);
  }, []);

  const setupObserver = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    const neededIds = new Set<string>();
    for (const link of links) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const id = href.slice(1);
        if (id) neededIds.add(id);
      }
    }

    const currentIds = new Set(elementsMap.current.keys());
    const idsEqual =
      neededIds.size === currentIds.size &&
      Array.from(neededIds).every((id) => currentIds.has(id));

    if (idsEqual && observerRef.current) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    let rootElement: Element | Document | null = null;
    if (root) {
      rootElement = "current" in root ? root.current : root;
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: rootElement,
      rootMargin,
      threshold: 0.3,
    });

    elementsMap.current.clear();
    for (const id of neededIds) {
      const el = document.getElementById(id);
      if (el && document.contains(el)) {
        elementsMap.current.set(id, el);
        observerRef.current.observe(el);
      }
    }
  }, [root, rootMargin, handleIntersect]);

  useEffect(() => {
    setupObserver();
    const map = elementsMap.current;
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      map.clear();
    };
  }, [setupObserver]);



  const contextValue = useMemo(() => ({ activeIds, position }), [activeIds, position]);

  const borderClass = position === "right" ? "border-s" : "border-e";
  const thumbInsetClass = position === "right" ? "inset-s-0" : "inset-e-0";

  return (
    <AnchorContext.Provider value={contextValue}>
      <nav
        aria-label="In-page anchor navigation"
        className={cn("relative", className)}
        {...props}
      >
        <div
          ref={thumbRef}
          className={cn(
            "absolute w-px bg-primary transition-[top,height] ease-linear",
            thumbInsetClass
          )}
        />
        <div
          ref={containerRef}
          className={cn("flex flex-col", borderClass, "border-transparent")}
        >
          <ul className={cn("flex flex-col gap-2 m-0 p-0 list-none")}>
            {children}
          </ul>
        </div>
      </nav>
    </AnchorContext.Provider>
  );
}

type AnchorSectionProps = {
  href?: string;
  linkText: string;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"li">>;
    link?: HTMLAttrs<Omit<React.ComponentProps<"a">, "href" | "children">>;
    subList?: HTMLAttrs<React.ComponentProps<"ul">>;
  };
  children?: React.ReactNode;
};

function AnchorSection({
  href,
  linkText,
  slotProps,
  children,
}: AnchorSectionProps) {
  const { activeIds, position } = useAnchorContext();
  const targetId = href?.replace(/^#/, "") || "";
  const isActive = !!href && activeIds.has(targetId);

  const paddingClass = position === "right" ? "ps-2" : "pe-2";


  return (
    <li
      {...slotProps?.wrapper}
      className={cn("m-0 p-0", slotProps?.wrapper?.className)}
    >
      <a
        {...slotProps?.link}
        href={href}
        data-active={isActive || undefined}
        aria-current={isActive ? "location" : undefined}
        className={cn(
          "block text-sm font-medium text-foreground hover:text-primary transition-colors",
          paddingClass,
          "data-[active=true]:text-primary",
          slotProps?.link?.className
        )}
      >
        {linkText}
      </a>
      {children && (
        <ul
          {...slotProps?.subList}
          className={cn(
            "flex flex-col gap-2 mt-2 ps-2 list-none",
            slotProps?.subList?.className
          )}
        >
          {children}
        </ul>
      )}
    </li>
  );
}

type AnchorItemProps = {
  href: string;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"li">>;
    link?: HTMLAttrs<Omit<React.ComponentProps<"a">, "href" | "children">>;
  };
  children?: React.ReactNode;
};

function AnchorItem({ href, slotProps, children }: AnchorItemProps) {
  const { activeIds, position } = useAnchorContext();
  const targetId = href.replace(/^#/, "");
  const isActive = activeIds.has(targetId);

  const paddingClass = position === "right" ? "ps-2" : "pe-2";


  return (
    <li
      {...slotProps?.wrapper}
      className={cn("m-0 p-px", slotProps?.wrapper?.className)}
    >
      <a
        {...slotProps?.link}
        href={href}
        data-active={isActive || undefined}
        aria-current={isActive ? "location" : undefined}
        className={cn(
          "block text-sm text-muted-foreground hover:text-foreground transition-colors",
          paddingClass,
          "data-[active=true]:text-primary",
          slotProps?.link?.className
        )}
      >
        {children}
      </a>
    </li>
  );
}

Anchor.Section = AnchorSection;
Anchor.Item = AnchorItem;

export type { AnchorProps, AnchorSectionProps, AnchorItemProps };
