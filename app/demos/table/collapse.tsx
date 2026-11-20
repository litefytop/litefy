"use client";

import { Table } from "@/ui/skins";

interface Task {
  title: string;
  summary: string;
  points: number;
}

const tasks: Task[] = [
  {
    title: "Design review",
    summary:
      "Walked through the updated dashboard wireframes with the design team; the empty states and the bulk action row need one more iteration before implementation starts next week.",
    points: 3,
  },
  {
    title: "API integration",
    summary: "Wire the sorting endpoint into the remote mode example.",
    points: 8,
  },
  {
    title: "Write tests",
    summary:
      "Cover the keyboard paths for column reordering and row selection, then add regression cases for the collapse column so expanding a row never desynchronizes the virtual window.",
    points: 5,
  },
  {
    title: "Release notes",
    summary: "Summarize the new collapse column and the header behavior change.",
    points: 1,
  },
];

export default function Demo() {
  return (
    <div className="w-full items-center">
      <Table
        data={tasks}
        getKey={(row) => row.title}
        columns={[
          { key: "title", header: "Task", sortable: true, span: 2 },
          { key: "summary", header: "Summary", collapse: true, span: 4 },
          { key: "points", header: "Points", sortable: true },
        ]}
      />
    </div>
  );
}
