"use client";

import { Table } from "@/ui";

interface Task {
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  points: number;
  done: boolean;
}

const tasks: Task[] = [
  { title: "Design review", owner: "Ada", priority: "high", points: 3, done: true },
  { title: "API integration", owner: "Linus", priority: "medium", points: 8, done: false },
  { title: "Write tests", owner: "Grace", priority: "high", points: 5, done: false },
  { title: "Release notes", owner: "Ada", priority: "low", points: 1, done: true },
];

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <Table
        data={tasks}
        getKey={(row) => row.title}
        columns={[
          { key: "title", header: "Task", sortable: true },
          { key: "owner", header: "Owner", width: "7rem" },
          {
            key: "priority",
            header: "Priority",
            sortable: true,
            width: "7rem",
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
          { key: "points", header: "Points", sortable: true, width: "6rem" },
          { key: "done", header: "Done", width: "5rem", render: (row) => (row.done ? "✓" : "—") },
        ]}
      />
    </div>
  );
}
