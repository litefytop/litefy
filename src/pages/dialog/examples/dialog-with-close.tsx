import { Button, Dialog } from "@/component";
import React from "react";

export default function DialogWithClose() {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
  return (
   <div>
    <Button variant="outline" onClick={() => dialogRef.current?.showModal()}>Open Dialog</Button>
     <Dialog ref={dialogRef}>

        <h2 className="text-lg font-semibold mb-2">Dialog with Close</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This dialog has both the X button and a custom close button.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => dialogRef.current?.close()}>Close Dialog</Button>
        </div>

    </Dialog>
   </div>
  );
}
