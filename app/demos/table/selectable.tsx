"use client";

import * as React from "react";
import { Button, Pagination, Table } from "@/ui/skins";

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
];

const PAGE_SIZE = 5;

function renderPriority(row: Task) {
  return (
    <span
      className={
        row.priority === "high"
          ? "font-medium text-danger-independent group-hover/table:text-inherit"
          : row.priority === "medium"
            ? "text-warning-independent"
            : "text-foreground"
      }
    >
      {row.priority}
    </span>
  );
}

export default function Demo() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const summary = `Showing 1–${Math.min(PAGE_SIZE, tasks.length)} of ${tasks.length} items${
    selected.length > 0 ? ` · ${selected.length} selected` : ""
  }`;

  return (
    <div className="flex w-full flex-col justify-center gap-y-2">
      <Table
        selectable
        data={tasks.slice(0, PAGE_SIZE)}
        rowKey={(row) => row.id}
        selected={selected}
        onSelectionChange={setSelected}
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
      <Pagination
        page={1}
        totalPages={totalPages}
        summary={
          <>
            {summary}
            {selected.length > 0 && (
              <Button data-variant="text" onClick={() => setSelected([])}>
                Clear
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}
