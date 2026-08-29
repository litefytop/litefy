"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CollapsePanel, CollapseRoot, CollapseTrigger } from "@/ui";
import { ChevronDown } from "lucide-react";

type AccordionCtxValue = {
  activeKey: string | undefined;
  toggle: (key: string) => void;
};
const AccordionDemoCtx = createContext<AccordionCtxValue | null>(null);

const useAccordionDemo = () => {
  const ctx = useContext(AccordionDemoCtx);
  if (!ctx) throw new Error("must inside AccordionDemoCtx provider");
  return ctx;
};

const items = [
  {
    itemKey: "item-1",
    label: "CollapseRoot",
    panel: (
      <p className="text-muted-foreground">
        <code>CollapseRoot</code> is the container component for the accordion/collapse. It handles
        layout, borders, rounded corners, and dividers. It accepts a <code>className</code> for
        custom styling and supports the <code>inert</code> attribute to control the disabled state.
      </p>
    ),
  },
  {
    itemKey: "item-2",
    label: "CollapseTrigger",
    panel: (
      <p className="text-muted-foreground">
        <code>CollapseTrigger</code> is the interactive button that toggles the panel open or
        closed. It is a <code>&lt;button&gt;</code> element that can be customised with labels,
        icons, and includes built‑in <code>aria‑expanded</code> and <code>aria‑controls</code> for
        accessibility.
      </p>
    ),
  },
  {
    itemKey: "item-3",
    label: "CollapsePanel",
    panel: (
      <p className="text-muted-foreground">
        <code>CollapsePanel</code> is the content container that expands and collapses. It is
        controlled by the <code>open</code> prop and includes a smooth height transition animation.
        It accepts a <code>className</code> for custom padding and styling, and supports a
        <code>slots</code> API for deeper customisation of its inner structure.
      </p>
    ),
  },
];

function CollapseItemDemo({ item }: { item: (typeof items)[number] }) {
  const { activeKey, toggle } = useAccordionDemo();
  const isOpen = activeKey === item.itemKey;

  return (
    <div className="flex flex-col">
      <CollapseTrigger
        className="w-full justify-between p-4 text-sm font-medium"
        onClick={() => toggle(item.itemKey)}
      >
        {item.label}
        <ChevronDown
          data-open={isOpen}
          className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
          aria-hidden
        />
      </CollapseTrigger>
      <CollapsePanel
        open={isOpen}
        className="text-sm text-muted-foreground"
        slots={{ content: { className: "px-4 pb-4" } }}
      >
        {item.panel}
      </CollapsePanel>
    </div>
  );
}

export default function Demo() {
  const [activeKey, setActiveKey] = useState<string | undefined>("item-1");

  const toggle = useCallback((key: string) => {
    setActiveKey((prev) => (prev === key ? undefined : key));
  }, []);

  return (
    <AccordionDemoCtx.Provider value={{ activeKey, toggle }}>
      <CollapseRoot className="w-md rounded-md border border-border divide-y">
        {items.map((cfg) => (
          <CollapseItemDemo key={cfg.itemKey} item={cfg} />
        ))}
      </CollapseRoot>
    </AccordionDemoCtx.Provider>
  );
}
