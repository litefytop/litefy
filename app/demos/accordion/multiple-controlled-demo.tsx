"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/ui";
import { Switch } from "@/ui";

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
  const [value, setValue] = useState<string[]>(["item-1"]);
  const allKeys = ["item-1", "item-2", "item-3"];

  const toggleAll = () =>
    setValue(value.length === allKeys.length ? [] : allKeys);

  return (
    <div className="flex flex-col gap-4 max-w-lg h-100">
      <Switch
        checked={value.length === allKeys.length}
        onCheckedChange={toggleAll}
      >
        Toggle Accordion
      </Switch>

      <Accordion
        value={value}
        onValueChange={setValue}
        multiple={true}
        className="justify-center"
        items={items.map((item) => ({
          value: item.value,
          label: (
            <div className="flex items-center justify-between w-full">
              <span>{item.label}</span>
              <Plus
                data-checked={value.includes(item.value) || undefined}
                className="w-4 h-4 transition-transform data-checked:rotate-45"
              />
            </div>
          ),
          content: item.content,
        }))}
      />
    </div>
  );
}
