"use client";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
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

export default function AccordionControlled() {
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
          {item.content}
        </Accordion.Item>
      ))}
      </Accordion>
    </div>
  );
}
