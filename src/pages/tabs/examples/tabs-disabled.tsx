import { Tabs } from "@/component/ui/tabs";

export default function TabsDisabled() {
  return (
    <Tabs
      options={[
        { value: "tab1", label: "General", children: <div className="p-4"><p>General settings content</p></div> },
        { value: "tab2", label: "Premium", disabled: true, children: <div className="p-4"><p>Premium features (disabled)</p></div> },
        { value: "tab3", label: "Advanced", children: <div className="p-4"><p>Advanced settings content</p></div> },
        { value: "tab4", label: "Beta", disabled: true, children: <div className="p-4"><p>Beta features (disabled)</p></div> },
      ]}
    />
  );
}
