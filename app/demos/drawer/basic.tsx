"use client";
import React, { useState } from "react";
import { Button } from "@/ui/skins";
import { Drawer } from "@/ui/skins";

export default function DrawerBasicDemo() {
  const [open, setOpen] = useState(false);
  const handleBackdropClick = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-col gap-3 items-center">
      <Button data-variant="outline" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        onBackdropClick={handleBackdropClick}
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-3">
            <h3>Drawer</h3>
            <p>
              A slide-in panel component supporting four placement positions, built on native HTML
              dialog element. Includes focus trap, keyboard navigation and backdrop click close
              behavior.
            </p>
          </div>
          <Button data-variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
