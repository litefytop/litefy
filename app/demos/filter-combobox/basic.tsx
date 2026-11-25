"use client";

import { useState } from "react";
import { FilterCombobox, type FilterComboboxField, type FilterRule } from "@/ui/skins";

const fields: FilterComboboxField[] = [
  {
    name: "summary", label: "Job", type: "text", aliases: ["work order", "title"],
    operators: ["contains", "notContains", "isEmpty", "isNotEmpty"],
  },
  {
    name: "status", label: "Status", type: "enum", aliases: ["state"],
    operators: ["is", "isNot", "isEmpty"],
    options: ["Scheduled", "Overdue", "On hold", "In progress", "Completed"].map((value) => ({ label: value, value })),
  },
  {
    name: "quote", label: "Quote", type: "number", aliases: ["amount", "price"],
    operators: ["is", "gt", "gte", "lt", "lte", "between"],
  },
  {
    name: "scheduledOn", label: "Scheduled on", type: "date",
    operators: ["is", "before", "after", "between"],
  },
];

export default function Demo() {
  const [rules, setRules] = useState<FilterRule[]>([
    { id: "seed", field: "quote", operator: "between", value: ["1000", "5000"] },
    {
      id: "long-summary",
      field: "summary",
      operator: "contains",
      value: "A very long service summary that must truncate inside the chip on narrow screens",
    },
  ]);
  return (
    <div className="flex w-full flex-col items-center">
      <FilterCombobox fields={fields} value={rules} onChange={setRules} />
    </div>
  );
}
