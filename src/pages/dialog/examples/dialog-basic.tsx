import { Button, Dialog } from "@/component";
import React from "react";

export default function DialogBasic() {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  return (
    <div>
      <Button variant="outline" onClick={() => dialogRef.current?.showModal()}>
        Open Dialog
      </Button>
      <Dialog ref={dialogRef}>
        <h2 className="text-lg font-semibold mb-2">Basic Dialog</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You can click the button or the curtain or press the Esc key to close.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => dialogRef.current?.close()}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
