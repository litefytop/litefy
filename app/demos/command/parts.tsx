"use client";
import * as React from "react";
import { CommandInput, CommandList, CommandRoot, type CommandConfig } from "@/ui";
import { Calendar, FileText, Folder, Settings, Users } from "lucide-react";

const items: CommandConfig[] = [
  {
    group: "Workspace",
    items: [
      { label: "New document", value: "new-doc", icon: <FileText /> },
      { label: "New event", value: "new-event", icon: <Calendar /> },
    ],
  },
  {
    group: "General",
    items: [
      { label: "Team members", value: "team", icon: <Users /> },
      { label: "New folder", value: "new-folder", icon: <Folder /> },
      { label: "Settings", value: "settings", icon: <Settings /> },
    ],
  },
];

export default function Demo() {
  const [lastRun, setLastRun] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <CommandRoot
        items={items}
        className="w-80 rounded-xl border shadow-elevated"
        onSelect={(item) => setLastRun(item.value ?? null)}
      >
        <CommandInput placeholder="Search…" />
        <CommandList className="max-h-64" />
      </CommandRoot>
      {lastRun && (
        <p className="text-sm text-muted-foreground">
          Last command: <span className="font-medium text-foreground">{lastRun}</span>
        </p>
      )}
    </div>
  );
}
