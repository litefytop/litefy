"use client";

import { Tabs } from "@/ui";

export default function TabsOrientationDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Horizontal (Default)</h3>
        <Tabs
          defaultValue="horizontal1"
          orientation="horizontal"
          options={[
            {
              value: "horizontal1",
              label: "First",
              content: "Horizontal tab content - first tab.",
            },
            {
              value: "horizontal2",
              label: "Second",
              content: "Horizontal tab content - second tab.",
            },
            {
              value: "horizontal3",
              label: "Third",
              content: "Horizontal tab content - third tab.",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Vertical</h3>
        <Tabs
          defaultValue="vertical1"
          orientation="vertical"
          options={[
            {
              value: "vertical1",
              label: "First",
              content: "Vertical tab content - first tab.",
            },
            {
              value: "vertical2",
              label: "Second",
              content: "Vertical tab content - second tab.",
            },
            {
              value: "vertical3",
              label: "Third",
              content: "Vertical tab content - third tab.",
            },
          ]}
        />
      </div>
    </div>
  );
}
