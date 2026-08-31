"use client";

import * as React from "react";
import { Tabs } from "@/ui";

export default function TabsControlledDemo() {
  const [value, setValue] = React.useState<string>("tab1");

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "tab1",
            label: "Tab One",
            content: "Controlled tab one content.",
          },
          {
            value: "tab2",
            label: "Tab Two",
            content: "Controlled tab two content.",
          },
          {
            value: "tab3",
            label: "Tab Three",
            content: "Controlled tab three content.",
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">Current tab: {value}</p>
    </div>
  );
}
