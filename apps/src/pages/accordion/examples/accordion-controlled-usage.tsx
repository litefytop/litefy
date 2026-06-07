import { useState } from "react";
import { Accordion } from "@/component/ui/accordion";

import { Switch } from "@/component/ui/switch";


export default function AccordionControlledUsage() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);
  const allKeys = ["item-1", "item-2", "item-3"];

  const toggleAll = () =>
    setOpenKeys(openKeys.length === allKeys.length ? [] : allKeys);
  return (
    <div className="flex flex-col gap-4 max-w-lg h-100">
    <Switch
      checked={openKeys.length === allKeys.length}
      onCheckedChange={toggleAll}
    >
      Toggle Accordion
    </Switch>
     
      <Accordion
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        allowMultiple={true}
        className="justify-center "
      >
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
