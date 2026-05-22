import { useState } from "react";
import { AccordionControlled } from "@/component/ui/accordion-controlled";

export default function AccordionControlledUsage() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Currently open: {openKeys.join(", ") || "None"}
      </div>
      <AccordionControlled
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
      >
        <AccordionControlled.Item value="item-1" label="First Item">
          <p>This is the content of the first item. Manage expanded items through controlled openKeys state.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-2" label="Second Item">
          <p>This is the content of the second item. Clicking any item will update the openKeys state.</p>
        </AccordionControlled.Item>
        <AccordionControlled.Item value="item-3" label="Third Item">
          <p>This is the content of the third item. You can programmatically control expand/collapse behavior.</p>
        </AccordionControlled.Item>
      </AccordionControlled>
    </div>
  );
}
