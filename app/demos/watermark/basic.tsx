"use client";

import { Watermark } from "@/ui/skins";
import { Card } from "@/ui/skins";

export default function Demo() {
  return (
    <Watermark className="w-full" text="litefy">
      <Card>
        <h3>Quarterly Report</h3>
        <p>
          A tiled text watermark is drawn over the content and follows the
          container size automatically.
        </p>
      </Card>
    </Watermark>
  );
}
