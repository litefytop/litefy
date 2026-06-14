"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export default function DialogBasicDemo() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => dialogRef.current?.showModal()}>
        Open Dialog
      </Button>
      <Dialog ref={dialogRef} className="w-full max-w-sm">
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Welcome to Litefy</h3>
            <p className="text-sm text-muted-foreground">
              A beautiful, fast, and modern React UI library for building
              accessible and customizable web applications with ease.
            </p>
          </div>
          <Button className="w-full" onClick={() => dialogRef.current?.close()}>
            Continue
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
