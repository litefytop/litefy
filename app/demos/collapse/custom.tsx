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
        <code>CollapseRoot</code> is the container for the accordion/collapse. It lays items out
        vertically and separates them with <code>not-last:border-b</code>. It accepts a{" "}
        <code>className</code> for custom styling and forwards all native div props.
      </p>
    ),
  },
  {
    itemKey: "item-2",
    label: "CollapseTrigger",
    panel: (
      <p className="text-muted-foreground">
        <code>CollapseTrigger</code> is the interactive button that toggles the panel open or
        closed. The <code>open</code> prop drives <code>aria-expanded</code>, and hover styles apply
        while collapsed.
      </p>
    ),
  },
  {
    itemKey: "item-3",
    label: "CollapsePanel",
    panel: (
      <p className="text-muted-foreground">
        <code>CollapsePanel</code> is the content container that expands and collapses through a
        grid rows transition driven by the <code>open</code> prop. <code>className</code> applies to
        the inner content wrapper for custom padding and styling.
      </p>
    ),
  },
];

function CollapseItemDemo({ item }: { item: (typeof items)[number] }) {
  const { activeKey, toggle } = useAccordionDemo();
  const isOpen = activeKey === item.itemKey;

  return (
    <>
      <CollapseTrigger open={isOpen} onClick={() => toggle(item.itemKey)}>
        {item.label}
        <ChevronDown
          data-open={isOpen}
          className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
          aria-hidden
        />
      </CollapseTrigger>
      <CollapsePanel open={isOpen} className="text-muted-foreground">
        {item.panel}
      </CollapsePanel>
    </>
  );
}

export default function Demo() {
  const [activeKey, setActiveKey] = useState<string | undefined>("item-1");

  const toggle = useCallback((key: string) => {
    setActiveKey((prev) => (prev === key ? undefined : key));
  }, []);

  return (
    <AccordionDemoCtx.Provider value={{ activeKey, toggle }}>
      <CollapseRoot className="w-md rounded-md border border-border">
        {items.map((cfg) => (
          <CollapseItemDemo key={cfg.itemKey} item={cfg} />
        ))}
      </CollapseRoot>
    </AccordionDemoCtx.Provider>
  );
}
