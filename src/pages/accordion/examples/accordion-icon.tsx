import { useState } from "react";
import { Accordion } from "@/component/ui/accordion";
import { Plus } from "lucide-react";

const items = [
  {
    value: "item-1",
    label: "Custom Icon",
    content:
      "Use the icon prop in function form to customize the expand/collapse icon.",
  },
  {
    value: "item-2",
    label: "Rotation Animation",
    content:
      "The icon rotates 45 degrees when expanded, creating a plus-to-x effect.",
  },
  {
    value: "item-3",
    label: "Full Control",
    content:
      "Combine with controlled mode to have complete control over component state and behavior.",
  },
];

export default function AccordionCustomIcon() {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return (
    <Accordion openKeys={openKeys} onOpenChange={setOpenKeys} className="h-64 justify-center">
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          value={item.value}
          label={item.label}
          icon={(open) => (
            <Plus
              data-checked={open}
              className={"w-4 h-4 transition-transform data-checked:rotate-45"}
            />
          )}
        >
          <p>{item.content}</p>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
