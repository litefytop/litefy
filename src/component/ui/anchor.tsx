import {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

interface AnchorContextValue {
  activeId: string;
  observer: IntersectionObserver | null;
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

function useAnchorContext() {
  const context = useContext(AnchorContext);
  if (!context) {
    throw new Error("Anchor subcomponents must be used within Anchor");
  }
  return context;
}

function useObserveAnchor(targetId: string) {
  const { observer } = useAnchorContext();
  const observedRef = useRef("");

  useEffect(() => {
    if (!targetId || !observer) return;
    if (observedRef.current === targetId) return;

    const el = document.getElementById(targetId);
    if (!el) return;

    observedRef.current = targetId;
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observedRef.current = "";
    };
  }, [targetId, observer]);
}

type AnchorProps = HTMLAttrs<React.ComponentProps<"nav">> & {
  rootMargin?: string;
  root?: Element | Document | null | React.RefObject<Element | Document | null>;
};

export function Anchor({
  className,
  children,
  root,
  rootMargin,
  ...props
}: AnchorProps) {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined") return window.location.hash.slice(1);
    return "";
  });

  useEffect(() => {
    const handleHashChange = () => {
      setActiveId(window.location.hash.slice(1));
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const observer = useMemo(() => {
    if (typeof window === "undefined") return null;

    let rootElement: Element | Document | null = null;
    if (root) {
      rootElement = "current" in root ? root.current : root;
    }

    return new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const rect = entry.boundingClientRect;
          if (!best) {
            best = entry;
          } else {
            const bestRect = best.boundingClientRect;
            const isBetter =
              rect.top >= 0 &&
              (rect.top < bestRect.top ||
                (rect.top === bestRect.top && rect.bottom > bestRect.bottom));
            if (isBetter) {
              best = entry;
            }
          }
        }
        if (best) {
          setActiveId(best.target.id);
        }
      },
      {
        root: rootElement,
        rootMargin: rootMargin || "0px 0px -80% 0px",
        threshold: 0,
      },
    );
  }, [rootMargin, root]);

  useEffect(() => {
    if (!observer) return;
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  const contextValue = useMemo(
    () => ({
      activeId,
      observer,
    }),
    [activeId, observer],
  );

  return (
    <AnchorContext.Provider value={contextValue}>
      <nav
        aria-label="In-page anchor navigation"
        className={cn(className)}
        {...props}
      >
        <ul className={cn("flex flex-col gap-2 m-0 p-0 list-none")}>
          {children}
        </ul>
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
  const { activeId } = useAnchorContext();
  const targetId = href?.replace(/^#/, "") || "";
  const isActive = !!href && activeId === targetId;

  useObserveAnchor(targetId);

  return (
    <li
      {...slotProps?.wrapper}
      className={cn("m-0 p-0", slotProps?.wrapper?.className)}
    >
      <a
        {...slotProps?.link}
        data-active={isActive ? "true" : undefined}
        aria-current={isActive ? "location" : undefined}
        className={cn(
          "text-sm font-medium text-foreground hover:text-primary",
          "data-active:text-primary data-active:underline data-active:underline-offset-4",
          slotProps?.link?.className,
        )}
        href={href}
      >
        {linkText}
      </a>
      {children && (
        <ul
          {...slotProps?.subList}
          className={cn(
            "flex flex-col gap-2 mt-2 pl-2 list-none",
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
  const { activeId } = useAnchorContext();
  const targetId = href.replace(/^#/, "");
  const isActive = activeId === targetId;

  useObserveAnchor(targetId);

  return (
    <li
      {...slotProps?.wrapper}
      className={cn("m-0 p-px", slotProps?.wrapper?.className)}
    >
      <a
        {...slotProps?.link}
        href={href}
        data-active={isActive ? "true" : undefined}
        aria-current={isActive ? "location" : undefined}
        className={cn(
          "block text-sm text-muted-foreground hover:text-foreground",
          "data-active:text-primary data-active:underline data-active:underline-offset-4",
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
