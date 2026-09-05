"use client";

import { useState } from "react";
import { List } from "@/ui";

const contacts = [
  { name: "Alice", role: "Engineering" },
  { name: "Bob", role: "Engineering" },
  { name: "Carol", role: "Design" },
  { name: "David", role: "Design" },
  { name: "Erin", role: "Marketing" },
];

export default function Demo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 w-xs">
      <List
        className="h-64 rounded-md border"
        items={contacts}
        getKey={(contact) => contact.name}
        getGroup={(contact) => contact.role}
        renderGroupHeader={(group) => group}
        classNames={{ item: "flex items-center gap-2" }}
        onSelect={(contact) => setSelected(contact.name)}
        renderItem={(contact) => (
          <>
            <span className="flex-1 truncate">{contact.name}</span>
            <span className="text-muted-foreground">{contact.role}</span>
          </>
        )}
      />
      <p className="text-sm text-muted-foreground wrap-break-word">
        Selected: {selected ?? "-"} — group headers are not navigable or selectable
      </p>
    </div>
  );
}
