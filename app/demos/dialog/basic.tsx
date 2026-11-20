"use client";
import { useState } from "react";
import { Button } from "@/ui/skins";
import { Dialog } from "@/ui/skins";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const handleBackdropClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button data-variant="outline" onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        onBackdropClick={handleBackdropClick}
        title="Welcome to Litefy"
      >
        <div className="flex flex-col gap-3">
          <p>
            A beautiful, fast, and modern React UI library for building accessible and
            customizable web applications with ease.
          </p>
          <Button onClick={() => setOpen(false)}>
            Continue
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
