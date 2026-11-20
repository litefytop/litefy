"use client";
import * as React from "react";
import { Command } from "@/ui/skins";
import {
  FilePlus,
  FolderPlus,
  House,
  Keyboard,
  LogOut,
  Moon,
  Search,
  Settings,
  UserRound,
} from "@/components/icons";

const items = [
  {
    group: "Actions",
    items: [
      { label: "Create file", value: "new-file", icon: <FilePlus />, shortcut: "⌘N" },
      { label: "Create folder", value: "new-folder", icon: <FolderPlus />, shortcut: "⇧⌘N" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { label: "Go home", value: "home", icon: <House /> },
      { label: "Open settings", value: "settings", icon: <Settings />, shortcut: "⌘,", keywords: ["preferences"] },
      { label: "View profile", value: "profile", icon: <UserRound /> },
    ],
  },
  {
    group: "Preferences",
    items: [
      { label: "Toggle theme", value: "theme", icon: <Moon />, keywords: ["dark", "light"] },
      { label: "Keyboard shortcuts", value: "shortcuts", icon: <Keyboard />, shortcut: "⌘/" },
      { label: "Sign out", value: "sign-out", icon: <LogOut />, disabled: true },
    ],
  },
];

export default function Demo() {
  const [open, setOpen] = React.useState(false);
  const [lastRun, setLastRun] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Command
        trigger={
          <>
            <Search />
            Search commands…
            <kbd className="inline-flex h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-sm px-1.5 py-0 backdrop-blur-md font-mono text-[0.625rem] leading-none font-semibold tracking-wide">⌘K</kbd>
          </>
        }
        items={items}
        open={open}
        onOpenChange={setOpen}
        placeholder="Type a command or search…"
        onSelect={(item) =>
          setLastRun(typeof item.label === "string" ? item.label : (item.value ?? "Command"))
        }
      />
      {lastRun && (
        <p>
          Last command: <span>{lastRun}</span>
        </p>
      )}
    </div>
  );
}
