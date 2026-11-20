"use client";

import { Table } from "@/ui/skins";

interface Task {
  title: string;
  owner: string;
  points: number;
}

const titles = [
  "Design review", "API integration", "Write tests", "Release notes",
  "Fix flaky test", "Update docs", "Refactor hooks", "Optimize bundle",
  "Add telemetry", "Rotate keys", "Patch CVE", "Migrate config",
];
const owners = ["Ada", "Linus", "Grace", "Edsger"];
const points = [3, 8, 5, 1, 2, 3, 8, 5, 3, 1, 5, 2];

const tasks: Task[] = titles.slice(0, 5).map((title, i) => ({
  title,
  owner: owners[i % owners.length],
  points: points[i],
}));

export default function Demo() {
  return (
    <Table
      zebra
      className="w-full"
      data={tasks}
      getKey={(row) => row.title}
      columns={[
        { key: "title", header: "Task", span: 3 },
        { key: "owner", header: "Owner" },
        { key: "points", header: "Points" },
      ]}
    />
  );
}
