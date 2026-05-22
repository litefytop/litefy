import { useState } from "react";
import { AccordionControlled } from "@/component/ui/accordion-controlled";

export default function AccordionControlledMultiple() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1", "item-2"]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Currently open: {openKeys.join(", ") || "None"}
      </div>
      <AccordionControlled
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        allowMultiple
      >
        <AccordionControlled.Item value="item-1" label="First Item">
          <p>Multiple items can be expanded simultaneously. Currently {openKeys.length} items are open.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-2" label="Second Item">
          <p>Enable multiple selection mode with the allowMultiple prop.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-3" label="Third Item">
          <p>Multiple items can be expanded at the same time without interfering with each other.</p>
        </AccordionControlled.Item>
      </AccordionControlled>
    </div>
  );
}
