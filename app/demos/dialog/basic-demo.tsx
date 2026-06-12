"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, type DialogControl } from "@/components/ui/dialog";

export default function DialogBasicDemo() {
  const dialogRef = useRef<DialogControl | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => dialogRef.current?.showModal()}>
        Open Dialog
      </Button>
      <Dialog controlRef={dialogRef}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Dialog Title</h3>
          <p>This is a basic dialog component.</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <Button onClick={() => dialogRef.current?.close()}>Confirm</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
