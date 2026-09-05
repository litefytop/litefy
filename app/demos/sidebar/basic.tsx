"use client";

import { Sidebar } from "@/ui";

export default function SidebarBasicDemo() {
  return (
    <div className="flex w-full h-48 border rounded-md overflow-hidden">
      <Sidebar className="w-48 p-4 border-r">
        <nav className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Dashboard</span>
          <span>Projects</span>
          <span>Settings</span>
        </nav>
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-muted-foreground">
        Main content
      </main>
    </div>
  );
}
