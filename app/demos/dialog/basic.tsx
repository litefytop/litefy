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
      <Dialog
        open={open}
        onOpenChange={setOpen}
        onBackdropClick={handleBackdropClick}
        title="Welcome to Litefy"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            A beautiful, fast, and modern React UI library for building accessible and
            customizable web applications with ease.
          </p>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Continue
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
