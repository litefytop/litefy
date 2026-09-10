"use client";

import { QueryBuilder } from "@/ui";

const fields = [
  { name: "name", label: "Name", operators: ["=", "!=", "contains"], valueKind: "text" as const },
  { name: "price", label: "Price", valueKind: "number" as const },
  { name: "created", label: "Created", valueKind: "date" as const },
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
  {
    name: "region",
    label: "Region",
    valueKind: "select" as const,
    options: [
      { label: "North America", value: "na" },
      { label: "Europe", value: "eu" },
      { label: "Asia Pacific", value: "apac" },
    ],
  },
];

export default function Demo() {
  return (
    <div className="w-full max-w-3xl">
      <QueryBuilder fields={fields} />
    </div>
  );
}
