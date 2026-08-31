"use client";

import { List } from "@/ui";

interface Task {
  id: number;
  title: string;
  status: string;
}

const tasks: Task[] = [
  { id: 1, title: "Design review", status: "todo" },
  { id: 2, title: "API integration", status: "in-progress" },
  { id: 3, title: "Write tests", status: "in-progress" },
  { id: 4, title: "Release notes", status: "done" },
  { id: 5, title: "Deploy", status: "todo" },
  { id: 6, title: "Retrospective", status: "todo" },
];

export default function ListBasicDemo() {
  return (
    <List
      className="h-40 w-full max-w-md rounded-md border"
      items={tasks}
      getKey={(task) => task.id}
      empty={<div className="px-3 py-4 text-center text-muted-foreground">No data</div>}
      renderItem={(task) => (
        <>
          <span className="flex-1 truncate">{task.title}</span>
          <span className="text-muted-foreground">{task.status}</span>
        </>
      )}
    />
  );
}
