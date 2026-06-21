"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function TabsBasicDemo() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Manage your account settings and preferences.
      </TabsContent>
      <TabsContent value="password">
        Change your password and security settings.
      </TabsContent>
      <TabsContent value="notifications">
        Configure your notification preferences.
      </TabsContent>
    </Tabs>
  );
}
