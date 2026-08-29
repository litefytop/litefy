"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckboxIndicator } from "@/ui";
import { Check, Minus } from "lucide-react";

type CheckboxGroupCtxValue = {
  values: string[];
  toggleItem: (val: string) => void;
  toggleAll: () => void;
  allChecked: boolean;
  indeterminate: boolean;
};
const CheckboxGroupDemoCtx = createContext<CheckboxGroupCtxValue | null>(null);

const useCheckboxGroupDemo = () => {
  const ctx = useContext(CheckboxGroupDemoCtx);
  if (!ctx) throw new Error("Checkbox items must be inside CheckboxGroupDemoCtx provider");
  return ctx;
};

const checkboxClass =
  "flex items-center justify-center  border border-border bg-background aria-checked:bg-primary text-background transition-colors [&_svg]:size-3 [&_svg]:stroke-4";

function CheckAllItem() {
  const { toggleAll, values, indeterminate } = useCheckboxGroupDemo();
  return (
    <label className="flex items-center gap-2">
      <CheckboxIndicator
        checked={values.length > 0}
        onCheckedChange={toggleAll}
        className={checkboxClass}
      >
        {indeterminate ? <Minus /> : <Check />}
      </CheckboxIndicator>
      <span>All</span>
    </label>
  );
}

function CheckItem({ value }: { value: string }) {
  const { values, toggleItem } = useCheckboxGroupDemo();
  return (
    <label key={value} className="flex items-center gap-2">
      <CheckboxIndicator
        checked={values.includes(value)}
        onCheckedChange={() => toggleItem(value)}
        className={checkboxClass}
      >
        <Check />
      </CheckboxIndicator>
      <span>{value}</span>
    </label>
  );
}

export default function Demo() {
  const [values, setValues] = useState<string[]>([]);
  const allValues = ["Controlled", "Group", "Custom"];

  const allChecked = allValues.every((v) => values.includes(v));
  const indeterminate = !allChecked && values.length > 0;

  const toggleAll = useCallback(() => {
    setValues(allChecked ? [] : allValues);
  }, [allChecked]);

  const toggleItem = useCallback((val: string) => {
    setValues((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  }, []);

  return (
    <CheckboxGroupDemoCtx.Provider
      value={{
        values,
        toggleItem,
        toggleAll,
        allChecked,
        indeterminate,
      }}
    >
      <div className="flex flex-col gap-4">
        <CheckAllItem />
        <div className="flex flex-col gap-2 pl-4">
          {allValues.map((val) => (
            <CheckItem key={val} value={val} />
          ))}
        </div>
      </div>
    </CheckboxGroupDemoCtx.Provider>
  );
}
