import { Tabs } from "@/component/ui/tabs";

export default function TabsBasic() {
  return (
    <Tabs
      options={[
        { value: "account", label: "Account", children: <div className="space-y-2"><h3 className="text-lg font-medium">Account Settings</h3><p className="text-muted-foreground">Manage your account preferences and settings.</p></div> },
        { value: "password", label: "Password", children: <div className="space-y-2"><h3 className="text-lg font-medium">Password Settings</h3><p className="text-muted-foreground">Change your password and security settings.</p></div> },
        { value: "notifications", label: "Notifications", children: <div className="space-y-2"><h3 className="text-lg font-medium">Notification Settings</h3><p className="text-muted-foreground">Configure how you receive notifications.</p></div> },
      ]}
    />
  );
}
