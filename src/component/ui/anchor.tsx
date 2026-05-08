import { useState, createContext, useContext, useEffect } from "react";
import { ClassNameValue, cn } from "@/lib";

interface AnchorContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

function useAnchorContext() {
  const context = useContext(AnchorContext);
  if (!context) {
    throw new Error("Anchor subcomponents must be used within Anchor");
  }
  return context;
}

function useObserveActiveId(targetId: string) {
  const { setActiveId } = useAnchorContext();

  useEffect(() => {
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(targetId);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -90% 0px", threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetId, setActiveId]);
}

type AnchorItemProps = Omit<React.ComponentProps<"a">, "className"> & {
  href: string;
  className?: ClassNameValue;
};

function AnchorItem({ href, className, children, ...props }: AnchorItemProps) {
  const { activeId, setActiveId } = useAnchorContext();
  const targetId = href.replace(/^#/, "");
  const isActive = activeId === targetId;

  useObserveActiveId(targetId);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveId(targetId);
    props.onClick?.(e);
  };

  return (
    <a
      href={href}
      className={cn(
        "block py-1 text-sm transition-colors indent-2",
        isActive
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

type AnchorSectionProps = Omit<React.ComponentProps<"div">, "className"> & {
  href?: string;
  title: string;
  className?: ClassNameValue;
  itemProps?: {
    title?: Omit<React.ComponentProps<"a">, "href">;
    nav?: Omit<React.ComponentProps<"nav">, "aria-label">;
  };
};

function AnchorSection({
  href,
  title,
  className,
  itemProps,
  children,
  ...props
}: AnchorSectionProps) {
  const { activeId, setActiveId } = useAnchorContext();
  const targetId = href?.replace(/^#/, "") || "";
  const isActive = href && activeId === targetId;

  useObserveActiveId(targetId);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href) {
      setActiveId(targetId);
    }
    itemProps?.title?.onClick?.(e);
  };

  return (
    <div className={cn(className)} {...props}>
      <a
        className={cn(
          "text-sm font-medium mb-2 transition-colors",
          isActive
            ? "text-primary"
            : "text-foreground hover:text-primary",
          !href && "pointer-events-none"
        )}
        href={href}
        onClick={handleClick}
        {...itemProps?.title}
      >
        {title}
      </a>
      {children && (
        <nav className="space-y-1" aria-label="页面内导航" {...itemProps?.nav}>
          {children}
        </nav>
      )}
    </div>
  );
}

type AnchorProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
};

export function Anchor({ className, children, ...props }: AnchorProps) {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.hash.slice(1) || "";
    }
    return "";
  });


  const handleSetActive = (id: string) => {
    if (id) {
      setActiveId(id);
    }
  };

  return (
    <AnchorContext.Provider value={{ activeId, setActiveId: handleSetActive }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AnchorContext.Provider>
  );
}

Anchor.Section = AnchorSection;
Anchor.Item = AnchorItem;
