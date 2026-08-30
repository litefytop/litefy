"use client";
import { useState, useRef, useEffect } from "react";
import { DialogRoot, DialogClose } from "@/ui";

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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-0 w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg text-foreground backdrop:bg-muted/50"
      >
        <DialogClose aria-label="Close (ESC)" onClick={() => setOpen(false)}>
          ESC
        </DialogClose>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Assembled from parts</h3>
            <p className="text-sm text-muted-foreground">
              A plain <code>DialogRoot</code> plus a <code>DialogClose</code>, with your own
              open/close lifecycle.
            </p>
          </div>
          <button
            className="w-full rounded-md border py-2 text-sm font-medium hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Continue
          </button>
        </div>
      </DialogRoot>
    </div>
  );
}
