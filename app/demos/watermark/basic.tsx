"use client";

import { Card, Watermark } from "@/ui";

export default function Demo() {
  return (
    <Watermark text="litefy" className="w-full max-w-sm rounded-xl">
      <Card className="p-6">
        <h3 className="text-lg font-semibold">Quarterly Report</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          A tiled text watermark is drawn over the content and follows the
          container size automatically.
        </p>
      </Card>
    </Watermark>
  );
}
