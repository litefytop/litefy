import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { ClassNameValue, cn } from "@/lib";

interface AnchorContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
  observer: IntersectionObserver;
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

    observer.observe(el);
    return () => {
      observer.unobserve(el);
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
      }
    );
  }, [rootMargin, root]);

  if (!observer) return null;

  return (
    <AnchorContext.Provider value={{ activeId, setActiveId, observer }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AnchorContext.Provider>
  );
}
type AnchorItemProps = Omit<React.ComponentProps<"a">, "className"> & {
  href: string;
  className?: ClassNameValue;
};

function AnchorItem({ href, className, children, ...props }: AnchorItemProps) {
  const { activeId,setActiveId } = useAnchorContext();
  const targetId = href.replace(/^#/, "");
  const isActive = activeId === targetId;

  useObserveAnchor(targetId);

  return (
    <a
      href={href}
      className={cn(
        "block py-1 text-sm  indent-2",
        isActive
          ? "text-primary font-medium underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => setActiveId(targetId)}
      {...props}
    >
      {children}
    </a>
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
        className={cn(
          "text-sm font-medium mb-2 ",
          isActive ? "text-primary  underline underline-offset-4" : "text-foreground hover:text-primary",
          !href && "pointer-events-none",
        )}
        href={href}
        {...itemProps?.link}
      >
        {linkText}
      </a>
      {children && (
        <nav
          className="space-y-1"
          aria-label="In-page navigation"
          {...itemProps?.nav}
        >
          {children}
        </nav>
      )}
    </div>
  );
}

Anchor.Section = AnchorSection;
Anchor.Item = AnchorItem;
