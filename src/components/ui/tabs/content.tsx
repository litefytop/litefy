"use client";

import { cn, ClassNameValue } from "@/lib";
import { useTabs } from "@/components";

const tabsContentclass = {
  base: "p-4",
};

export type TabsContentProps = {
  value: string;
  className?: ClassNameValue;
  area?: string;
  children?: React.ReactNode;
};

export function TabsContent({
  value,
  className,
  area,
  children
}: TabsContentProps) {
  const { value: activeValue } = useTabs();
  if (activeValue !== value) {
    return null;
  }
  return (
    <div className={cn(TabsContent.class.base, className)} style={{ gridArea: area }}>
      {children}
    </div>
  );
}

TabsContent.class = tabsContentclass;
