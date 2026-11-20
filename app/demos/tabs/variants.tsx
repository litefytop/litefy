"use client";

import { Tabs } from "@/ui/skins";

const options = [
  { value: "overview", label: "Overview", content: "Overview content" },
  { value: "analytics", label: "Analytics", content: "Analytics content" },
  { value: "reports", label: "Reports", content: "Reports content" },
  { value: "settings", label: "Settings", content: "Settings content" },
];

export default function TabsVariantsDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Tabs variant="primary" options={options} defaultValue="overview" className="w-full" />
    </div>
  );
}
