import { Tabs } from "@/component/ui/tabs";

export default function TabsVertical() {
  return (
    <Tabs
      orientation="vertical"
      options={[
        { value: "overview", label: "Overview", children: <div className="p-4"><h3 className="text-lg font-medium mb-2">Overview</h3><p className="text-muted-foreground">This is the overview section with general information.</p></div> },
        { value: "analytics", label: "Analytics", children: <div className="p-4"><h3 className="text-lg font-medium mb-2">Analytics</h3><p className="text-muted-foreground">View your analytics data and insights here.</p></div> },
        { value: "reports", label: "Reports", children: <div className="p-4"><h3 className="text-lg font-medium mb-2">Reports</h3><p className="text-muted-foreground">Access and download your reports.</p></div> },
        { value: "settings", label: "Settings", children: <div className="p-4"><h3 className="text-lg font-medium mb-2">Settings</h3><p className="text-muted-foreground">Configure your application settings.</p></div> },
      ]}
    />
  );
}
