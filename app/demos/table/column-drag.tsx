"use client";

import * as React from "react";
import { Table } from "@/ui/skins";

interface Task {
  title: string;
  owner: string;
  points: number;
}

const titles = [
  "Design review", "API integration", "Write tests", "Release notes",
  "Fix flaky test", "Update docs", "Refactor hooks", "Optimize bundle",
];
const owners = ["Ada", "Linus", "Grace", "Edsger"];
const points = [3, 8, 5, 1, 2, 3, 8, 5];

const tasks: Task[] = titles.slice(0, 5).map((title, i) => ({
  title,
  owner: owners[i % owners.length],
  points: points[i],
}));

export default function Demo() {
  const [order, setOrder] = React.useState<string[]>(["title", "owner", "points"]);

  return (
    <Table
      columnDrag
      columnOrder={order}
      onColumnsChange={setOrder}
      data={tasks}
      getKey={(row) => row.title}
      columns={[
        { key: "title", header: "Task", sortable: true, span: 3 },
        { key: "owner", header: "Owner", sortable: true },
        { key: "points", header: "Points", sortable: true },
      ]}
    />
  );
}
