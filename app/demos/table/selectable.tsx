"use client";

import * as React from "react";
import { Button, Table } from "@/ui/skins";

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
];

function renderPriority(row: Task) {
  return (
    <span
      className={
        row.priority === "high"
          ? "font-medium text-danger-fg"
          : row.priority === "medium"
            ? "text-warning-fg"
            : "text-surface-fg"
      }
    >
      {row.priority}
    </span>
  );
}

export default function Demo() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Table
      selectable
      className="w-full"
      data={tasks}
      rowKey={(row) => row.id}
      selected={selected}
      onSelectionChange={setSelected}
      bulkActions={<Button data-variant="text">Export</Button>}
      columns={[
        { key: "title", header: "Task", span: 3 },
        { key: "owner", header: "Owner" },
        {
          key: "priority",
          header: "Priority",
          render: renderPriority,
        },
      ]}
    />
  );
}
