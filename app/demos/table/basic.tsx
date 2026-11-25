"use client";

import { Table } from "@/ui/skins";

interface Task {
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  points: number;
  done: boolean;
}

const titles = [
  "Design review", "API integration", "Write tests", "Release notes",
  "Fix flaky test", "Update docs", "Refactor hooks", "Optimize bundle",
  "Add telemetry", "Rotate keys", "Patch CVE", "Migrate config",
];
const owners = ["Ada", "Linus", "Grace", "Edsger"];
const priorities = ["high", "medium", "low"] as const;
const points = [3, 8, 5, 1, 2, 3, 8, 5, 3, 1, 5, 2];

const tasks: Task[] = titles.slice(0, 5).map((title, i) => ({
  title,
  owner: owners[i % owners.length],
  priority: priorities[i % priorities.length],
  points: points[i],
  done: i % 3 === 0,
}));

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
  return (
    <div className="w-full items-center">
      <Table
        data={tasks}
        getKey={(row) => row.title}
        columns={[
          { key: "title", header: "Task", sortable: true, span: 3 },
          { key: "owner", header: "Owner", sortable: true, span: 2 },
          {
            key: "priority",
            header: "Priority",
            sortable: true,
            span: 2,
            render: renderPriority,
          },
          { key: "points", header: "Points", sortable: true },
          { key: "done", header: "Done", render: (row) => (row.done ? "✓" : "—") },
        ]}
      />
    </div>
  );
}
