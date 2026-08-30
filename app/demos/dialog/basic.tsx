"use client";
import { useState } from "react";
import { Button } from "@/ui";
import { Dialog } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const handleBackdropClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} onBackdropClick={handleBackdropClick}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Welcome to Litefy</h3>
            <p className="text-sm text-muted-foreground">
              A beautiful, fast, and modern React UI library for building accessible and
              customizable web applications with ease.
            </p>
          </div>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Continue
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
