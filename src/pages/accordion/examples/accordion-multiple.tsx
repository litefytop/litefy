import { useState } from "react";
import { Accordion } from "@/component/ui/accordion";

export default function AccordionMultiple() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1", "item-2"]);

  return (
    <div >
      <div className="text-sm text-muted-foreground">
        Currently open: {openKeys.join(", ") || "None"}
      </div>
      <Accordion
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        allowMultiple
        className="h-72 justify-center"
      >
        <Accordion.Item value="item-1" label="First Item">
          <p>Multiple items can be expanded simultaneously. Currently {openKeys.length} items are open.</p>
        </Accordion.Item>
        <Accordion.Item value="item-2" label="Second Item">
          <p>Enable multiple selection mode with the allowMultiple prop.</p>
        </Accordion.Item>
        <Accordion.Item value="item-3" label="Third Item">
          <p>Multiple items can be expanded at the same time without interfering with each other.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
