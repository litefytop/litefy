import { useState, createContext, useContext, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib";

interface AnatomyContextValue {
  activePart: string | null;
  setActivePart: (part: string | null, partType?: 'id' | 'name') => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const AnatomyContext = createContext<AnatomyContextValue | null>(null);

function useAnatomy() {
  const context = useContext(AnatomyContext);
  if (!context) {
    throw new Error("Anatomy components must be used within Anatomy");
  }
  return context;
}

interface AnatomyPart {
  id?: string;
  name?: string;
  label: string;
}

interface AnatomyGroup {
  title: string;
  items: AnatomyPart[];
}

interface AnatomyProps {
  title?: string;
  children: React.ReactNode;
  parts: AnatomyPart[] | AnatomyGroup[];
  className?: string;
}

export function Anatomy({ title = "Anatomy", children, parts, className }: AnatomyProps) {
  const [activePart, setActivePartState] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setActivePart = useCallback((part: string | null, partType: 'id' | 'name' = 'id') => {
    if (!containerRef.current) return;

    if (activePart) {
      const prevEl = partType === 'id' 
        ? document.getElementById(activePart)
        : containerRef.current.querySelector(`[data-anatomy-name="${activePart}"]`);
      prevEl?.classList.remove('anatomy-highlight');
    }

    if (part) {
      const newEl = partType === 'id'
        ? document.getElementById(part)
        : containerRef.current.querySelector(`[data-anatomy-name="${part}"]`);
      newEl?.classList.add('anatomy-highlight');
    }

    setActivePartState(part);
  }, [activePart]);

  const contextValue = useMemo(
    () => ({
      activePart,
      setActivePart,
      containerRef,
    }),
    [activePart, setActivePart],
  );
  return (
    <AnatomyContext.Provider value={contextValue}>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div ref={containerRef} className={cn("border rounded-lg p-6 min-h-[200px] flex items-center justify-center bg-muted/20", className)}>
          {children}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {'items' in (parts[0] || {}) ? (
            <div className="space-y-3">
              {(parts as AnatomyGroup[]).map((group, groupIndex) => (
                <div key={groupIndex}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{group.title}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((part) => (
                      <AnatomyItem
                        key={part.id || part.name}
                        id={part.id}
                        name={part.name}
                        label={part.label}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {(parts as AnatomyPart[]).map((part) => (
                <AnatomyItem
                  key={part.id || part.name}
                  id={part.id}
                  name={part.name}
                  label={part.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AnatomyContext.Provider>
  );
}

function AnatomyItem({ id, name, label }: { id?: string; name?: string; label: string }) {
  const { activePart, setActivePart } = useAnatomy();
  const partKey = id || name;
  const partType = id ? 'id' : 'name';
  const isActive = activePart === partKey;

  return (
    <button
      onClick={() => setActivePart(isActive ? null : partKey!, partType)}
      data-active={isActive}
      className={cn(
        "w-full text-left px-3 py-2 text-sm rounded-md border border-border",
        "transition-all duration-200",
        "hover:bg-muted",
        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
      )}
    >
      {label}
    </button>
  );
}

