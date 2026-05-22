import { useState } from "react";
import { AccordionControlled } from "@/component/ui/accordion-controlled";

export default function AccordionControlledDisabled() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <div className="space-y-4">
      <AccordionControlled
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        disabled
      >
        <AccordionControlled.Item value="item-1" label="Disabled Item 1">
          <p>This item is disabled because the parent AccordionControlled is disabled.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-2" label="Disabled Item 2">
          <p>All items are disabled and cannot be interacted with.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-3" label="Disabled Item 3">
          <p>The disabled state applies inert attribute to prevent all interactions.</p>
        </AccordionControlled.Item>
      </AccordionControlled>

      <AccordionControlled
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
      >
        <AccordionControlled.Item value="item-4" label="Enabled Item">
          <p>This accordion is still enabled and functional.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-5" label="Disabled Item" disabled>
          <p>This single item is disabled while others remain enabled.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-6" label="Enabled Item">
          <p>You can still interact with this item.</p>
        </AccordionControlled.Item>
      </AccordionControlled>
    </div>
  );
}
