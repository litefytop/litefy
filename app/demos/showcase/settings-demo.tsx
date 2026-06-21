import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

const tzOptions = [
  { label: "UTC", value: "utc" },
  { label: "Asia/Shanghai", value: "shanghai" },
  { label: "America/New_York", value: "ny" },
  { label: "Europe/London", value: "london" },
];

export default function SettingsDemo() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      <p className="mt-1 text-sm text-fd-muted-foreground">
        Manage your profile, notifications and security preferences.
      </p>
      <Tabs
        defaultValue="profile"
        orientation="vertical"
        variant="button"
        className="mt-6"
      >
        <TabsList className="w-44 self-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col gap-4 p-2">
            <div>
              <label htmlFor="display-name" className="text-sm font-medium">
                Display name
              </label>
              <Input
                id="display-name"
                className="mt-1.5"
                placeholder="Display name"
                defaultValue="Alex Johnson"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                className="mt-1.5"
                type="email"
                placeholder="Email address"
                defaultValue="alex@litefy.dev"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <Select
                id="timezone"
                className="mt-1.5"
                options={tzOptions}
                defaultValue="shanghai"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary">Save changes</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center justify-between rounded-lg border border-fd-border p-3">
              <div>
                <div className="text-sm font-medium">Email notifications</div>
                <div className="text-xs text-fd-muted-foreground">
                  Receive product updates and tips
                </div>
              </div>
              <Switch defaultChecked>On</Switch>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-fd-border p-3">
              <div>
                <div className="text-sm font-medium">Weekly digest</div>
                <div className="text-xs text-fd-muted-foreground">
                  Summary of your activity
                </div>
              </div>
              <Switch>Off</Switch>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-fd-border p-3">
              <div>
                <div className="text-sm font-medium">Marketing emails</div>
                <div className="text-xs text-fd-muted-foreground">
                  Promotions and offers
                </div>
              </div>
              <Switch>Off</Switch>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="flex flex-col gap-3 p-2">
            <div>
              <label htmlFor="new-password" className="text-sm font-medium">
                New password
              </label>
              <Input
                id="new-password"
                className="mt-1.5"
                type="search"
                placeholder="New password"
                defaultValue="••••••••"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-fd-border p-3">
              <div>
                <div className="text-sm font-medium">Two-factor auth</div>
                <div className="text-xs text-fd-muted-foreground">
                  Add an extra layer of security
                </div>
              </div>
              <Switch defaultChecked>On</Switch>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary">Update password</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
