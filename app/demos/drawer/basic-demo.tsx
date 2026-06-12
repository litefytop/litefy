"use client";

import { useRef } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function DrawerBasicDemo() {
  const drawerRef = useRef<{ show: () => void; close: () => void }>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => drawerRef.current?.show()}>
        Open Drawer
      </Button>
      <Drawer ref={drawerRef}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Drawer Title</h3>
          <p>This is a basic drawer component.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => drawerRef.current?.close()}>
              Close
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}