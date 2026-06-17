"use client";

import React from "react";
import { Button } from "@/ui/button";
import { Drawer } from "@/ui/drawer";

export default function DrawerBasicDemo() {
  const controlRef = React.useRef<HTMLDialogElement>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => controlRef.current?.showModal()}>
        Open Drawer
      </Button>
      <Drawer ref={controlRef}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Welcome to Litefy</h3>
            <p className="text-sm text-muted-foreground word-break">
              A beautiful, fast, and modern React UI library for building
              accessible and customizable web applications with ease.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => controlRef.current?.close()}
          >
            Continue
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
