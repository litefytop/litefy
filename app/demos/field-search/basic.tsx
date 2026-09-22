"use client";

import * as React from "react";
import { FieldSearch } from "@/ui";

export default function Demo() {
  const [query, setQuery] = React.useState({ field: "name", value: "" });

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FieldSearch
        fields={[
          { value: "name", label: "Name", placeholder: "Search by name" },
          { value: "email", label: "Email", placeholder: "Search by email" },
          {
            value: "status",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ],
          },
        ]}
        onSearch={(field, value) => setQuery({ field, value })}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Filtering where{" "}
        <span className="text-foreground">{query.field}</span> = "{query.value || "*"}"
      </p>
    </div>
  );
}
