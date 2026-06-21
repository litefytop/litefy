"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function TabsVariantDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Line Variant (Default)</h3>
        <Tabs defaultValue="tab1" variant="line">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            Content for tab one with line variant.
          </TabsContent>
          <TabsContent value="tab2">
            Content for tab two with line variant.
          </TabsContent>
          <TabsContent value="tab3">
            Content for tab three with line variant.
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Button Variant</h3>
        <Tabs defaultValue="tab1" variant="button">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            Content for tab one with button variant.
          </TabsContent>
          <TabsContent value="tab2">
            Content for tab two with button variant.
          </TabsContent>
          <TabsContent value="tab3">
            Content for tab three with button variant.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
