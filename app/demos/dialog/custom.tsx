"use client";
import { useState, useRef, useEffect } from "react";
import { Button, DialogRoot, DialogClose, DialogContent } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={() => setOpen(true)}>Open Dialog</Button>
      <DialogRoot
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="backdrop:bg-muted/50"
      >
        <DialogClose aria-label="Close (ESC)" onClick={() => setOpen(false)}>
          ESC
        </DialogClose>
        <DialogContent className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Assembled from parts</h3>
            <p className="text-sm text-muted-foreground">
              A plain <code>DialogRoot</code> plus a <code>DialogClose</code> and a{" "}
              <code>DialogContent</code>, with your own open/close lifecycle.
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Continue
          </Button>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
