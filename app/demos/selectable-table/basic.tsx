"use client";

import * as React from "react";
import { SelectableTable } from "@/ui";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
}

const tasks: Task[] = [
  { id: "t-01", title: "Design review", owner: "Ada", priority: "high" },
  { id: "t-02", title: "API integration", owner: "Linus", priority: "medium" },
  { id: "t-03", title: "Write tests", owner: "Grace", priority: "high" },
  { id: "t-04", title: "Release notes", owner: "Ada", priority: "low" },
  { id: "t-05", title: "Fix flaky test", owner: "Linus", priority: "high" },
  { id: "t-06", title: "Update docs", owner: "Grace", priority: "medium" },
  { id: "t-07", title: "Refactor hooks", owner: "Ada", priority: "low" },
  { id: "t-08", title: "Optimize bundle", owner: "Linus", priority: "high" },
  { id: "t-09", title: "Add telemetry", owner: "Grace", priority: "medium" },
  { id: "t-10", title: "Rotate keys", owner: "Ada", priority: "high" },
  { id: "t-11", title: "Patch CVE", owner: "Linus", priority: "low" },
  { id: "t-12", title: "Migrate config", owner: "Grace", priority: "medium" },
];

export default function Demo() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="w-full max-w-xl">
      <SelectableTable
        data={tasks}
        rowKey={(row) => row.id}
        selected={selected}
        onSelectionChange={setSelected}
        columns={[
          { key: "title", header: "Task" },
          { key: "owner", header: "Owner" },
          {
            key: "priority",
            header: "Priority",
            render: (row) => (
              <span
                className={
                  row.priority === "high"
                    ? "font-medium text-danger"
                    : row.priority === "medium"
                      ? "text-warning"
                      : "text-muted-foreground"
                }
              >
                {row.priority}
              </span>
            ),
          },
        ]}
      />
      <p className="mt-2 text-sm text-muted-foreground">{selected.length} selected</p>
    </div>
  );
}
