import { useState, useEffect, createContext, useContext } from "react";
import { ClassNameValue, cn } from "@/lib";

interface AnchorContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
  scrollToElement: (targetId: string) => void;
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

function useAnchorContext() {
  const context = useContext(AnchorContext);
  if (!context) {
    throw new Error("Anchor subcomponents must be used within Anchor");
  }
  return context;
}

type AnchorItemProps = Omit<React.ComponentProps<"a">, "className"> & {
  id: string;
  className?: ClassNameValue;
};

function AnchorItem({
  id,
  className,
  children,
  ...props
}: AnchorItemProps) {
  const { activeId, setActiveId, scrollToElement } = useAnchorContext();
  const targetId = id.replace(/^#/, "");
  const isActive = activeId === targetId;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveId(targetId);
    scrollToElement(targetId);
    props.onClick?.(e);
  };

  return (
    <a
      href={id}
      onClick={handleClick}
      className={cn(
        "block py-1 text-sm transition-colors indent-2",
        isActive
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

type AnchorSectionProps = Omit<React.ComponentProps<"div">, "className"> & {
  id: string;
  title: string;
  className?: ClassNameValue;
};

function AnchorSection({
  id,
  title,
  className,
  children,
  ...props
}: AnchorSectionProps) {
  const { setActiveId, scrollToElement } = useAnchorContext();
  const targetId = id.replace(/^#/, "");

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    setActiveId(targetId);
    scrollToElement(targetId);
  };

  return (
    <div id={id} className={cn("mb-4", className)} {...props}>
      <h4
        className="text-sm font-medium text-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
        onClick={handleClick}
      >
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

type AnchorProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  container?: string | HTMLElement | React.RefObject<HTMLElement | null>;
};

export function Anchor({
  className,
  children,
  container,
  ...props
}: AnchorProps) {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.hash.slice(1) || "";
    }
    return "";
  });

  useEffect(() => {
    const getContainer = (): HTMLElement | Document => {
      if (!container) return document;
      if (typeof container === "string") return document.querySelector(container) as HTMLElement || document;
      if ("current" in container) return container.current || document;
      return container;
    };

    const containerEl = getContainer();
    if (!containerEl) return;

    const handleScroll = () => {
      const elements = containerEl.querySelectorAll("[data-anchor-id]");
      for (const el of Array.from(elements).reverse()) {
        const rect = el.getBoundingClientRect();
        const containerRect = containerEl instanceof Document 
          ? document.documentElement.getBoundingClientRect()
          : containerEl.getBoundingClientRect();
        if (rect.top - containerRect.top <= 100) {
          setActiveId(el.getAttribute("data-anchor-id") || "");
          return;
        }
      }
    };

    containerEl.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => containerEl.removeEventListener("scroll", handleScroll);
  }, [container]);

  const scrollToElement = (targetId: string) => {
    const getContainer = (): HTMLElement | Document => {
      if (!container) return document;
      if (typeof container === "string") return document.querySelector(container) as HTMLElement || document;
      if ("current" in container) return container.current || document;
      return container;
    };

    const containerEl = getContainer();
    if (!containerEl) return;

    const element = containerEl.querySelector(`#${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnchorContext.Provider value={{ activeId, setActiveId, scrollToElement }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AnchorContext.Provider>
  );
}

Anchor.Section = AnchorSection;
Anchor.Item = AnchorItem;
