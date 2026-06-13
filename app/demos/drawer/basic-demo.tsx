"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";

export default function DrawerBasicDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Welcome to Litefy</h3>
            <p className="text-sm text-muted-foreground word-break">
              A beautiful, fast, and modern React UI library for building
              accessible and customizable web applications with ease.
            </p>
          </div>
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            Continue
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
