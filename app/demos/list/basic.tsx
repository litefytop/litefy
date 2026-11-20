"use client";

import { List } from "@/ui/skins";

interface Task {
  id: number;
  title: string;
  owner: string;
  status: string;
}

const tasks: Task[] = [
  { id: 1, title: "Design review", owner: "Alice", status: "To do" },
  { id: 2, title: "Write tests", owner: "Bob", status: "To do" },
  { id: 3, title: "API integration", owner: "Carol", status: "In progress" },
  { id: 4, title: "Deploy", owner: "Dave", status: "In progress" },
  { id: 5, title: "Release notes", owner: "Erin", status: "Done" },
];

export default function ListBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <List
        items={tasks}
        getKey={(task) => task.id}
        getGroup={(task) => task.status}
        renderGroupHeader={(group) => group}
        empty={<div>No data</div>}
        renderItem={(task) => (
          <div className="flex flex-wrap gap-2">
            <span>{task.title}</span>
            <span className="ms-auto">{task.owner}</span>
          </div>
        )}
      />
    </div>
  );
}
