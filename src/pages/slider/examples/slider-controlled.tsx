import { useState } from "react";
import { Slider } from "@/component/ui/slider";

export function SliderControlled() {
  const [value, setValue] = useState(50);

  return (
    <Slider
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-56"
      label="Slider Controlled"
      description={`Current value: ${value}`}
    />
  );
}
