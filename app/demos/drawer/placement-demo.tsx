"use client";

import { useRef } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function DrawerPlacementDemo() {
  const leftDrawerRef = useRef<{ show: () => void; close: () => void }>(null);
  const rightDrawerRef = useRef<{ show: () => void; close: () => void }>(null);
  const topDrawerRef = useRef<{ show: () => void; close: () => void }>(null);
  const bottomDrawerRef = useRef<{ show: () => void; close: () => void }>(null);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button variant="outline" onClick={() => leftDrawerRef.current?.show()}>
        Left
      </Button>
      <Button variant="outline" onClick={() => rightDrawerRef.current?.show()}>
        Right
      </Button>
      <Button variant="outline" onClick={() => topDrawerRef.current?.show()}>
        Top
      </Button>
      <Button variant="outline" onClick={() => bottomDrawerRef.current?.show()}>
        Bottom
      </Button>

      <Drawer ref={leftDrawerRef} placement="left">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Left Drawer</h3>
          <p>Drawer positioned on the left side.</p>
          <Button variant="outline" onClick={() => leftDrawerRef.current?.close()}>
            Close
          </Button>
        </div>
      </Drawer>

      <Drawer ref={rightDrawerRef} placement="right">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Right Drawer</h3>
          <p>Drawer positioned on the right side.</p>
          <Button variant="outline" onClick={() => rightDrawerRef.current?.close()}>
            Close
          </Button>
        </div>
      </Drawer>

      <Drawer ref={topDrawerRef} placement="top">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Top Drawer</h3>
          <p>Drawer positioned at the top.</p>
          <Button variant="outline" onClick={() => topDrawerRef.current?.close()}>
            Close
          </Button>
        </div>
      </Drawer>

      <Drawer ref={bottomDrawerRef} placement="bottom">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Bottom Drawer</h3>
          <p>Drawer positioned at the bottom.</p>
          <Button variant="outline" onClick={() => bottomDrawerRef.current?.close()}>
            Close
          </Button>
        </div>
      </Drawer>
    </div>
  );
}