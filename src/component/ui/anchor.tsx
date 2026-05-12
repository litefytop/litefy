import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { ClassNameValue, cn } from "@/lib";

interface AnchorContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
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

  useEffect(() => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) {
      return;
    }

    observer?.observe(el);
    return () => {
      observer?.unobserve(el);
    };
  }, [targetId, observer]);
}

type AnchorProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
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

  const observer = useMemo(() => {
    if (typeof window === "undefined") return null;

    const rootElement = root && "current" in root ? root.current : root;

    const isInIframe = window.self !== window.top;
    const fallbackRoot = isInIframe ? document.documentElement : null;

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
                (rect.top >= bestRect.top && rect.bottom < bestRect.bottom));

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
        root: rootElement ?? fallbackRoot,
        rootMargin: rootMargin || "0px 0px -90% 0px",
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
      setActiveId,
      observer,
    }),
    [activeId, observer],
  );
  return (
    <AnchorContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AnchorContext.Provider>
  );
}

type AnchorSectionProps = Omit<React.ComponentProps<"div">, "className"> & {
  href?: string;
  linkText?: string;
  className?: ClassNameValue;
  itemProps?: {
    link?: Omit<React.ComponentProps<"a">, "href">;
    nav?: Omit<React.ComponentProps<"nav">, "aria-label">;
  };
};

function AnchorSection({
  href,
  linkText,
  className,
  itemProps,
  children,
  ...props
}: AnchorSectionProps) {
  const { activeId } = useAnchorContext();
  const targetId = href?.replace(/^#/, "") || "";
  const isActive = href && activeId === targetId;

  useObserveAnchor(targetId);

  return (
    <div className={cn(className)} {...props}>
      <a
        data-active={isActive}
        data-link={!href}
        className={cn(
          "text-sm font-medium",
          "data-[active=true]:text-primary data-[active=true]:underline data-[active=true]:underline-offset-4",
          "data-[active=false]:text-foreground data-[active=false]:hover:text-primary",
          "data-[link=false]:pointer-events-none",
          className,
        )}
        href={href}
        {...itemProps?.link}
      >
        {linkText}
      </a>
      {children && (
        <nav
          className="flex flex-col gap-2 mt-2"
          aria-label="In-page navigation"
          {...itemProps?.nav}
        >
          {children}
        </nav>
      )}
    </div>
  );
}

type AnchorItemProps = Omit<React.ComponentProps<"a">, "className"> & {
  href: string;
  className?: ClassNameValue;
};

function AnchorItem({ href, className, children, ...props }: AnchorItemProps) {
  const { activeId, setActiveId } = useAnchorContext();
  const targetId = href.replace(/^#/, "");
  const isActive = activeId === targetId;

  useObserveAnchor(targetId);

  return (
    <a
      href={href}
      data-active={isActive}
      className={cn(
        "block text-sm indent-2",
        "data-[active=true]:text-primary data-[active=true]:font-medium data-[active=true]:underline data-[active=true]:underline-offset-4",
        "data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground",
        className,
      )}
      onClick={() => setActiveId(targetId)}
      {...props}
    >
      {children}
    </a>
  );
}

Anchor.Section = AnchorSection;
Anchor.Item = AnchorItem;
