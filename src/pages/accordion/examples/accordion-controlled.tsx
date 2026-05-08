import { useState } from "react";
import { Accordion } from "@/component";

export default function AccordionControlled() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <Accordion openKeys={openKeys} onOpenChange={setOpenKeys}>
      <Accordion.Item value="item-1" title="Controlled Mode">
        <p>Currently open keys: {openKeys.join(", ")}</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="Click to Toggle">
        <p>Control the expanded state via openKeys and onOpenChange.</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="Initialization">
        <p>You can set initial expanded items in defaultOpenKeys.</p>
      </Accordion.Item>
    </Accordion>
  );
}
