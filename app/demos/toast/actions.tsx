"use client";
import { useState } from "react";
import { Button, Toaster } from "@/ui";

export default function Demo() {
  const [id, setId] = useState<string | number | null>(null);

  const show = () => {
    if (id !== null) return;
    const toastId = Toaster.info({
      title: "File uploaded",
      description: "quarterly-report.pdf · 2.4 MB",
      duration: Infinity,
      onClose: (event) => {
        if (event.type === "complete") setId(null);
      },
      actions: [
        {
          children: "View",
          className: "text-primary hover:bg-transparent",
          onClick: (dismiss) => dismiss(),
        },
        { children: "Dismiss", onClick: (dismiss) => dismiss() },
      ],
    });
    setId(toastId);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Toaster />
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={show} disabled={id !== null}>
          Show Action Toast
        </Button>
        <Button variant="outline" onClick={() => Toaster.dismiss()}>
          Dismiss All
        </Button>
      </div>
    </div>
  );
}
