"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function TabsControlledDemo() {
  const [value, setValue] = React.useState<string>("tab1");

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="tab1">Tab One</TabsTrigger>
          <TabsTrigger value="tab2">Tab Two</TabsTrigger>
          <TabsTrigger value="tab3">Tab Three</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Controlled tab one content.</TabsContent>
        <TabsContent value="tab2">Controlled tab two content.</TabsContent>
        <TabsContent value="tab3">Controlled tab three content.</TabsContent>
      </Tabs>
      <p className="text-sm text-muted-foreground">Current tab: {value}</p>
    </div>
  );
}
