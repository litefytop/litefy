"use client";

import * as React from "react";
import { Tab, Tabs } from "@/ui";

export default function TabsControlledDemo() {
  const [value, setValue] = React.useState<string>("tab1");

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <Tab value="tab1" label="Tab One">
          Controlled tab one content.
        </Tab>
        <Tab value="tab2" label="Tab Two">
          Controlled tab two content.
        </Tab>
        <Tab value="tab3" label="Tab Three">
          Controlled tab three content.
        </Tab>
      </Tabs>
      <p className="text-sm text-muted-foreground">Current tab: {value}</p>
    </div>
  );
}
