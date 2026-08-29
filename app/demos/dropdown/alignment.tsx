"use client";
import { Button } from "@/ui";
import { Dropdown } from "@/ui";
export default function DropdownAlignmentDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Position Area</h3>
        <div className="flex gap-4">
          <Dropdown
            style={{ positionArea: "bottom span-right", justifySelf: "start" }}
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "span-right",
              },
            }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          />
          <Dropdown
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "bottom span-all",
              },
            }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          />
          <Dropdown
            style={{ positionArea: "bottom span-left", justifySelf: "end" }}
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "span-left",
              },
            }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Align X (sidebar)</h3>
        <div className="flex gap-4">
          <Dropdown
            alignX="start"
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "alignX start",
              },
            }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          />
          <Dropdown
            alignX="end"
            slots={{
              trigger: {
                className: [Button.class.base, Button.class.variant.primary],
                children: "alignX end",
              },
            }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          />
        </div>
      </div>
    </div>
  );
}
