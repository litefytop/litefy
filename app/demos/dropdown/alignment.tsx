"use client";
import { Button } from "@/ui";
import { Dropdown } from "@/ui";

export default function DropdownAlignmentDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-4">
          Horizontal Alignment (alignX)
        </h3>
        <div className="flex gap-4">
          <Dropdown
            alignX="start"
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "Start Align",
              },
            }}
            items={[
              { itemType: "action", label: "Item 1" },
              { itemType: "action", label: "Item 2" },
              { itemType: "action", label: "Item 3" },
            ]}
          />
          <Dropdown
            alignX="center"
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "Center Align",
              },
            }}
            items={[
              { itemType: "action", label: "Item 1" },
              { itemType: "action", label: "Item 2" },
              { itemType: "action", label: "Item 3" },
            ]}
          />
          <Dropdown
            alignX="end"
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "End Align",
              },
            }}
            items={[
              { itemType: "action", label: "Item 1" },
              { itemType: "action", label: "Item 2" },
              { itemType: "action", label: "Item 3" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
