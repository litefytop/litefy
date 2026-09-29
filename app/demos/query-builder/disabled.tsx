"use client";

import { QueryBuilder, type QueryGroup } from "@/ui";

const fields = [
  { name: "name", label: "Name", valueKind: "text" as const },
  { name: "price", label: "Price", valueKind: "number" as const },
  {
    name: "status",
    label: "Status",
    valueKind: "select" as const,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Archived", value: "archived" },
    ],
  },
];

const defaultValue: QueryGroup = {
  combinator: "and",
  rules: [
    { field: "name", operator: "contains", value: "fung" },
    { field: "price", operator: ">", value: "30" },
    { field: "status", operator: "in", value: ["active", "inactive"] },
  ],
};

export default function Demo() {
  return (
    <div className="w-full max-w-3xl">
      <QueryBuilder fields={fields} defaultValue={defaultValue} disabled />
    </div>
  );
}
