"use client";

import { Order } from "@/ui";

interface Step {
  id: number;
  title: string;
  owner: string;
}

const steps: Step[] = [
  { id: 1, title: "Freeze the release branch", owner: "Alice" },
  { id: 2, title: "Run the regression suite", owner: "Bob" },
  { id: 3, title: "Write release notes", owner: "Carol" },
  { id: 4, title: "Tag and deploy", owner: "Alice" },
  { id: 5, title: "Announce in the changelog", owner: "Bob" },
];

export default function ListOrderDemo() {
  return (
    <Order
      className="h-40 w-full max-w-md border"
      items={steps}
      getKey={(step) => step.id}
      empty={<div className="px-3 py-4 text-center text-muted-foreground">No steps</div>}
      classNames={{ item: "flex items-center gap-2" }}
      renderItem={(step) => (
        <>
          <span className="flex-1 truncate">{step.title}</span>
          <span className="text-muted-foreground">{step.owner}</span>
        </>
      )}
    />
  );
}
