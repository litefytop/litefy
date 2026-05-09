import { Button, Dialog } from "@/component";
import React from "react";

export default function DialogWithTrigger() {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  return (
    <div>
      <Button variant="primary" onClick={() => dialogRef.current?.showModal()}>
        Open with Primary Button
      </Button>
      <Dialog ref={dialogRef}>
        <h2 className="text-lg font-semibold mb-2">Dialog with Trigger</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You can customize the trigger button using any props.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => dialogRef.current?.close()}>Cancel</Button>
        </div>
      </Dialog>
    </div>
  );
}
