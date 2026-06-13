"use client";

import { ChevronsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";

export default function DrawerPlacementDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
      <Drawer
        placement="bottom"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        className="flex flex-col items-center"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="flex justify-center bg-muted w-3xs rounded-t-xl"
        >
          <ChevronsUp className="size-4 text-muted-foreground" />
        </button>
        <div className="flex flex-col gap-6 pt-4 w-md">
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
