import { useState } from "react";
import { Tabs } from "@/component/ui/tabs";

export default function TabsControlled() {
  const [value, setValue] = useState("tab1");

  return (
    <div className="space-y-4">
      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          { value: "tab1", label: "Tab 1", children: <div className="p-4"><p>Content for Tab 1. Current value: {value}</p></div> },
          { value: "tab2", label: "Tab 2", children: <div className="p-4"><p>Content for Tab 2. Current value: {value}</p></div> },
          { value: "tab3", label: "Tab 3", children: <div className="p-4"><p>Content for Tab 3. Current value: {value}</p></div> },
        ]}
      />
      <div className="text-sm text-muted-foreground">
        Selected tab: <span className="font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
