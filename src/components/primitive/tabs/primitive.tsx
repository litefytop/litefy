"use client";

import * as React from "react";
import { TabsContext } from "./context";

export interface TabsPrimitiveProps {
  children: React.ReactNode ;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function TabsPrimitive({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
}: TabsPrimitiveProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = React.useCallback(
    (newValue: string) => {
      if (isControlled) {
        onValueChange?.(newValue);
      } else {
        setUncontrolledValue(newValue);
      }
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      value,
      setValue,
      isControlled,
    }),
    [value, setValue, isControlled]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
}
