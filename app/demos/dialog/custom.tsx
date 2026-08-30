"use client";
import { useState, useRef, useEffect } from "react";
import { DialogRoot, DialogClose, DialogContent } from "@/ui";

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
      <button onClick={() => setOpen(true)}>Open Dialog</button>
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
          <button
            className="w-full rounded-md border py-2 text-sm font-medium hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Continue
          </button>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
