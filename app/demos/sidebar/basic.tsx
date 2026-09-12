"use client";

import { useRef } from "react";
import { Sidebar, type SidebarHandle } from "@/ui";

export default function SidebarBasicDemo() {
  const sidebarRef = useRef<SidebarHandle>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => sidebarRef.current?.toggle()}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Toggle
        </button>
        <button
          type="button"
          onClick={() => sidebarRef.current?.open()}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => sidebarRef.current?.close()}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Close
        </button>
      </div>
      <div className="flex w-full h-48 border rounded-md overflow-hidden">
        <Sidebar ref={sidebarRef} defaultOpen className="w-48 p-4 border-r">
          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Dashboard</span>
            <span>Projects</span>
            <span>Settings</span>
          </nav>
        </Sidebar>
        <main className="flex-1 p-4 text-sm text-muted-foreground">
          Main content, controlled through the sidebar ref
        </main>
      </div>
    </div>
  );
}
