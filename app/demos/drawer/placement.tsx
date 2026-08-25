"use client";

import React, { useState } from "react";
import { Button } from "@/ui";
import { Drawer } from "@/ui";

export default function DrawerPlacementDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer placement="bottom" open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-6 pt-4 w-md">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Welcome to Litefy</h3>
            <p className="text-sm text-muted-foreground word-break">
              A beautiful, fast, and modern React UI library for building accessible and
              customizable web applications with ease.
            </p>
          </div>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Continue
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
