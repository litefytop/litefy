"use client";

import * as React from "react";

export interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  isControlled: boolean;
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a Tabs component");
  }
  return context;
}
