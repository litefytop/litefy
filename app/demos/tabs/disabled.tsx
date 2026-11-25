import { Tabs } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <Tabs
        defaultValue="account"
        options={[
          {
            value: "account",
            label: "Account",
            disabled: true,
            content: "Manage your account settings and preferences.",
          },
          {
            value: "password",
            label: "Password",
            disabled: true,
            content: "Change your password and security settings.",
          },
          {
            value: "notifications",
            label: "Notifications",
            disabled: true,
            content: "Configure your notification preferences.",
          },
        ]}
      />
    </div>
  );
}
