"use client";

import { Slider } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <Slider defaultValue={50} label="Volume" disabled />
      </div>
    </div>
  );
}
