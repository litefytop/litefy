"use client";

import { Table } from "@/ui";

interface Task {
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

const titles = [
  "Design review", "API integration", "Write tests", "Release notes",
  "Fix flaky test", "Update docs", "Refactor hooks", "Optimize bundle",
  "Add telemetry", "Rotate keys", "Patch CVE", "Migrate config",
];
const owners = ["Ada", "Linus", "Grace", "Edsger"];
const priorities = ["high", "medium", "low"] as const;

const tasks: Task[] = titles.map((title, i) => ({
  title,
  owner: owners[i % owners.length],
  priority: priorities[i % priorities.length],
  done: i % 3 === 0,
}));

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <Table
        data={tasks}
        getKey={(row) => row.title}
        classNames={{ body: "h-48" }}
        columns={[
          { key: "title", header: "Task", sortable: true },
          { key: "owner", header: "Owner", sortable: true },
          { key: "priority", header: "Priority" },
        ]}
      />
    </div>
  );
}
