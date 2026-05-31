import { Tabs } from "@/component/ui/tabs";

export default function TabsStyled() {
  return (
    <Tabs
      className="max-w-lg"
      slotProps={{
        list: { className: "bg-muted/30 p-1 rounded-lg" },
        trigger: { className: "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground" },
        content: { className: "bg-card rounded-md shadow-sm mt-2" },
      }}
      options={[
        { value: "tab1", label: "Tab 1", children: <div className="p-4"><p>Styled content for Tab 1</p></div> },
        { value: "tab2", label: "Tab 2", children: <div className="p-4"><p>Styled content for Tab 2</p></div> },
        { value: "tab3", label: "Tab 3", children: <div className="p-4"><p>Styled content for Tab 3</p></div> },
      ]}
    />
  );
}
