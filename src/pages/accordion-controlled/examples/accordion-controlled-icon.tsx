import { useState } from "react";
import { AccordionControlled } from "@/component/ui/accordion-controlled";
import { Plus } from "lucide-react";

export default function AccordionControlledCustomIcon() {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return (
    <AccordionControlled
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      icon={(open) => <Plus className={`w-4 h-4 transition-transform ${open ? "rotate-45" : ""}`} />}
    >
      <AccordionControlled.Item value="item-1" label="Custom Icon">
        <p>Use the icon prop in function form to customize the expand/collapse icon.</p>
      </AccordionControlled.Item>
      <AccordionControlled.Item value="item-2" label="Rotation Animation">
        <p>The icon rotates 45 degrees when expanded, creating a plus-to-x effect.</p>
      </AccordionControlled.Item>
      <AccordionControlled.Item value="item-3" label="Full Control">
        <p>Combine with controlled mode to have complete control over component state and behavior.</p>
      </AccordionControlled.Item>
    </AccordionControlled>
  );
}
