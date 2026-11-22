"use client";

import { Command } from "@/ui/skins";
import { House, LogOut, Settings } from "@/components/icons";

const items = [
  { label: "Go home", value: "home", icon: <House />, disabled: true },
  { label: "Open settings", value: "settings", icon: <Settings />, shortcut: "⌘,", disabled: true },
  { label: "Sign out", value: "sign-out", icon: <LogOut />, disabled: true },
];

export default function Demo() {
  return (
    <div className="dim flex flex-col items-center">
      <Command
        trigger={<>Commands…<kbd className="kbd">⌘K</kbd></>}
        items={items}
        placeholder="Type a command or search…"
        inert
      />
    </div>
  );
}
