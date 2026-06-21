"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function TabsOrientationDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Horizontal (Default)</h3>
        <Tabs defaultValue="horizontal1" orientation="horizontal">
          <TabsList>
            <TabsTrigger value="horizontal1">First</TabsTrigger>
            <TabsTrigger value="horizontal2">Second</TabsTrigger>
            <TabsTrigger value="horizontal3">Third</TabsTrigger>
          </TabsList>
          <TabsContent value="horizontal1">
            Horizontal tab content - first tab.
          </TabsContent>
          <TabsContent value="horizontal2">
            Horizontal tab content - second tab.
          </TabsContent>
          <TabsContent value="horizontal3">
            Horizontal tab content - third tab.
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Vertical</h3>
        <Tabs defaultValue="vertical1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="vertical1">First</TabsTrigger>
            <TabsTrigger value="vertical2">Second</TabsTrigger>
            <TabsTrigger value="vertical3">Third</TabsTrigger>
          </TabsList>
          <TabsContent value="vertical1">
            Vertical tab content - first tab.
          </TabsContent>
          <TabsContent value="vertical2">
            Vertical tab content - second tab.
          </TabsContent>
          <TabsContent value="vertical3">
            Vertical tab content - third tab.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
