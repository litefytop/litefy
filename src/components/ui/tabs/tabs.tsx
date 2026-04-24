"use client";

import { cn, ClassNameValue } from "@/lib";
import { Segment, TabsPrimitive, TabsPrimitiveProps, Text } from "@/components";
import { TabsList } from "./list";
import { TabsContent } from "./content";

const tabsclass = {
  base: "flex flex-col",
};

export type TabsProps = TabsPrimitiveProps & {
  className?: ClassNameValue;
  area?: string;
};

export function Tabs({ 
  className,
  area,
  children,
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive {...props}>
      <div className={cn(Tabs.class.base, className)} style={{ gridArea: area }}>
        {children}
      </div>
    </TabsPrimitive>
  );
}

Tabs.class = tabsclass;
Tabs.List = TabsList;
Tabs.Content = TabsContent;

const TabsTrigger = ({children,...props}: React.ComponentProps<typeof Segment.Item>) => {
  return (
    <Segment.Item {...props}>
      <Text>{children}</Text>
    </Segment.Item>
  );
};

Tabs.Trigger = TabsTrigger;
