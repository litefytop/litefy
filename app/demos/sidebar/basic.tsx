"use client";

import { useRef } from "react";
import { Button, Sidebar, type SidebarHandle } from "@/ui";

export default function SidebarBasicDemo() {
  const sidebarRef = useRef<SidebarHandle>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => sidebarRef.current?.toggle()}>
          Toggle
        </Button>
        <Button variant="outline" onClick={() => sidebarRef.current?.open()}>
          Open
        </Button>
        <Button variant="outline" onClick={() => sidebarRef.current?.close()}>
          Close
        </Button>
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
