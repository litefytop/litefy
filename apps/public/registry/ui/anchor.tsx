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

type AnchorScrollConfig =
  | true
  | {
      container?: HTMLElement | (() => HTMLElement) | "window";
    };

type AnchorProps = Omit<React.ComponentProps<"nav">, "className"> & {
  className?: ClassNameValue;
  position?: "left" | "right";
  hashScroll?: AnchorScrollConfig;
  intersectionObserverOptions?: IntersectionObserverInit;
};

export function Anchor({
  className,
  children,
  position = "right",
  hashScroll,
  intersectionObserverOptions,
  ...props
}: AnchorProps) {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const activeIdsRef = useRef(activeIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMap = useRef<Map<string, Element>>(new Map());
  const linkPositionsRef = useRef<Map<string, { top: number; bottom: number }>>(
    new Map(),
  );

  useEffect(() => {
    activeIdsRef.current = activeIds;
  }, [activeIds]);


  const registerLinkPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    const newPositions = new Map<string, { top: number; bottom: number }>();
    const containerRect = container.getBoundingClientRect();

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) continue;
      const id = href.slice(1);
      if (!id) continue;

      const styles = getComputedStyle(link);
      const linkRect = link.getBoundingClientRect();
      const top =
        linkRect.top - containerRect.top + parseFloat(styles.paddingTop);
      const bottom =
        linkRect.bottom - containerRect.top - parseFloat(styles.paddingBottom);
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
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [registerLinkPositions, updateThumb]);

  useEffect(() => {
    updateThumb();
  }, [activeIds, updateThumb]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
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
    },
    [],
  );

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

    const options: IntersectionObserverInit = {
      root: intersectionObserverOptions?.root ?? null,
      rootMargin: intersectionObserverOptions?.rootMargin ?? "0px",
      threshold: intersectionObserverOptions?.threshold,
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    elementsMap.current.clear();
    for (const id of neededIds) {
      const el = document.getElementById(id);
      if (el && document.contains(el)) {
        elementsMap.current.set(id, el);
        observerRef.current.observe(el);
      }
    }
  }, [intersectionObserverOptions, handleIntersect]);

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

  useEffect(() => {
    if (!hashScroll) return;

    const getContainer = (): Window | HTMLElement => {
      if (hashScroll === true) return window;
      const container = hashScroll.container;
      if (!container || container === "window") return window;
      if (typeof container === "function") return container();
      return container;
    };

    const performScroll = (targetId: string) => {
      const element = document.getElementById(targetId);
      if (!element) return;
      const container = getContainer();
      if (container === window) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const containerEl = container as HTMLElement;
        const containerRect = containerEl.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offset =
          elementRect.top - containerRect.top + containerEl.scrollTop;
        containerEl.scrollTo({ top: offset, behavior: "smooth" });
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) performScroll(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [hashScroll]);

  const contextValue = useMemo(
    () => ({ activeIds, position }),
    [activeIds, position],
  );

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
            thumbInsetClass,
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
          "text-sm text-foreground hover:text-primary transition-colors",
          paddingClass,
          "data-[active=true]:text-primary",
          slotProps?.link?.className,
        )}
      >
        {linkText}
      </a>
      {children && (
        <ul
          {...slotProps?.subList}
          className={cn(
            "flex flex-col gap-2 mt-2 ps-2 list-none",
            slotProps?.subList?.className,
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
          slotProps?.link?.className,
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
