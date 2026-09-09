"use client";

import { Table } from "@/ui";

interface Task {
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

const tasks: Task[] = [
  { title: "Design review", owner: "Ada", priority: "high", done: true },
  { title: "API integration", owner: "Linus", priority: "medium", done: false },
  { title: "Write tests", owner: "Grace", priority: "high", done: false },
  { title: "Release notes", owner: "Ada", priority: "low", done: true },
];

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <Table
        data={tasks}
        getKey={(row) => row.title}
        columns={[
          { key: "title", header: "Task", sortable: true },
          { key: "owner", header: "Owner", sortable: true },
          {
            key: "priority",
            header: "Priority",
            sortable: true,
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
          { key: "done", header: "Done", align: "right", render: (row) => (row.done ? "✓" : "—") },
        ]}
      />
    </div>
  );
}
