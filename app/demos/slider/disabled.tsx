"use client";

import { Slider } from "@/ui/skins";

export default function Demo() {
  return (
    <div inert className="flex flex-col items-center">
      <Slider defaultValue={50} label="Volume" disabled className="w-77" />
    </div>
  );
}
