"use client";

import { Paper } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full justify-center overflow-x-auto py-2">
      <Paper format="a5">
        <div className="typography flex max-w-none flex-col gap-2">
          <h3>Invoice #2048</h3>
          <p>
            Paper is always white with black ink — on screen and on print — so a dark scheme never
            reaches the printer.
          </p>
          <ul>
            <li>A4 and letter sizes are real physical dimensions</li>
            <li>Print drops the screen shadow and keeps the sheet toner-safe</li>
          </ul>
        </div>
      </Paper>
    </div>
  );
}
