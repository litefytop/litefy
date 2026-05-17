"use client";

import * as React from "react";
import { ClassNameValue, cn } from "@/lib";

type DialogProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
};

function Dialog({ className, children, ...props }: DialogProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.close();
    }
  };

  return (
    <dialog
      onClick={handleBackdropClick}
      className={cn(
        "fixed inset-0 m-auto w-full max-w-md rounded-lg border bg-background p-6 shadow-lg text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}

export { Dialog };
