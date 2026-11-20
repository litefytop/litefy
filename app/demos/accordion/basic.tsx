"use client";

import { useState } from "react";
import { Accordion } from "@/ui/skins";

const items = [
  {
    itemKey: "item-1",
    label: "Mode",
    panel: (
      <p>
        Toggle the <code>multiple</code> prop to switch between single-select and multi-select
        modes. Single-select allows only one panel open at a time, while multi-select supports
        expanding multiple panels simultaneously.
      </p>
    ),
  },
  {
    itemKey: "item-2",
    label: "Global Quick Styling",
    panel: (
      <p>
        Use <code>common.classNames</code> to set shared styles for all items. You can customize the
        root wrapper, trigger button and content panel in one place, instead of configuring
        className for every single item separately.
      </p>
    ),
  },
  {
    itemKey: "item-3",
    label: "Global Custom Icon",
    panel: (
      <p>
        The <code>common.icon</code> prop provides a global icon configuration. It accepts static
        ReactNode or a render function receiving the <code>open</code> state. This avoids repeating
        icon setup across each item definition.
      </p>
    ),
  },
  {
    itemKey: "item-4",
    label: "Data-driven API",
    panel: (
      <p>
        This component adopts a pure data-driven pattern. All accordion items are configured via the
        items array. Keeping a single consistent paradigm avoids messy rendering inconsistencies
        that often occur when mixing data-driven definitions with nested child elements.
      </p>
    ),
  },
];

export default function Demo() {
  const [value, setValue] = useState<string | undefined>("");

  return (
    <div className="mx-auto">
      <Accordion
        multiple={false}
        activeKeys={value}
        onKeyChange={setValue}
        items={items}
      />
    </div>
  );
}
