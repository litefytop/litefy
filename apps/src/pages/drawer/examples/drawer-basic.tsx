"use client";
import { useState, useRef } from "react";
import { Button, Drawer, DrawerRef } from "@/component";

const placements = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
] as const;

export default function Demo() {
  const drawerRef = useRef<DrawerRef>(null);
  const [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom">("right");

  const handleOpen = (p: "left" | "right" | "top" | "bottom") => {
    setPlacement(p);
    drawerRef.current?.show();
  };

  return (
    <div className="flex gap-2">
      {placements.map((p) => (
        <Button
          key={p.value}
          variant="outline"
          onClick={() => handleOpen(p.value)}
        >
          {p.label}
        </Button>
      ))}

      <Drawer ref={drawerRef} placement={placement}>
        <h2 className="text-lg font-semibold mb-2">{placement} Drawer</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You can click the backdrop or press the Esc key to close.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => drawerRef.current?.close()}>
            Cancel
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
