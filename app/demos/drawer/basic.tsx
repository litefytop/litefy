"use client";
import React, { useState } from "react";
import { Button } from "@/ui";
import { Drawer } from "@/ui";

export default function DrawerBasicDemo() {
  const [open, setOpen] = useState(false);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        onBackdropClick={handleBackdropClick}
      >
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Drawer</h3>
            <p className="text-sm text-muted-foreground">
              A slide‑in panel component supporting four placement positions, built on native HTML
              dialog element. Includes focus trap, keyboard navigation and backdrop click close
              behavior.
            </p>
          </div>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
