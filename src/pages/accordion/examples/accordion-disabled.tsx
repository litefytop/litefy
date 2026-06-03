import { useState } from "react";
import { Accordion } from "@/component/ui/accordion";

export default function AccordionDisabled() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <div className="space-y-4">
      <Accordion
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        disabled
      >
        <Accordion.Item value="item-1" label="Disabled Item 1">
          <p>This item is disabled because the parent Accordion is disabled.</p>
        </Accordion.Item>
        <Accordion.Item value="item-2" label="Disabled Item 2">
          <p>All items are disabled and cannot be interacted with.</p>
        </Accordion.Item>
        <Accordion.Item value="item-3" label="Disabled Item 3">
          <p>The disabled state applies inert attribute to prevent all interactions.</p>
        </Accordion.Item>
      </Accordion>

      <Accordion
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        className="h-64 justify-center"
      >
        <Accordion.Item value="item-4" label="Enabled Item">
          <p>This accordion is still enabled and functional.</p>
        </Accordion.Item>
        <Accordion.Item value="item-5" label="Disabled Item" disabled>
          <p>This single item is disabled while others remain enabled.</p>
        </Accordion.Item>
        <Accordion.Item value="item-6" label="Enabled Item">
          <p>You can still interact with this item.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
