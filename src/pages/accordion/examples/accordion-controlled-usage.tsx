import { useState } from "react";
import { Accordion } from "@/component/ui/accordion";

export default function AccordionControlledUsage() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Currently open: {openKeys.join(", ") || "None"}
      </div>
      <Accordion openKeys={openKeys} onOpenChange={setOpenKeys}>
        <Accordion.Item value="item-1" label="First Item">
          <p>
            This is the content of the first item. Manage expanded items through
            controlled openKeys state.
          </p>
        </Accordion.Item>
        <Accordion.Item value="item-2" label="Second Item">
          <p>
            This is the content of the second item. Clicking any item will
            update the openKeys state.
          </p>
        </Accordion.Item>
        <Accordion.Item value="item-3" label="Third Item">
          <p>
            This is the content of the third item. You can programmatically
            control expand/collapse behavior.
          </p>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
