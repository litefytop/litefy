"use client";
import { useState } from "react";
import { RadioLabel, RadioIndicator, RadioRoot } from "@/ui";
import { Check } from "lucide-react";

const SIZES = ["Small", "Medium", "Large"];

export default function Demo() {
  const [size, setSize] = useState("Medium");

  return (
    <div className="flex flex-col gap-2">
      {SIZES.map((val) => (
        <RadioLabel key={val}>
          <RadioIndicator className="has-checked:bg-primary">
            <RadioRoot
              name="size"
              checked={size === val}
              onChange={() => setSize(val)}
            />
            <Check className="size-3 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100" />
          </RadioIndicator>
          <span>{val}</span>
        </RadioLabel>
      ))}
    </div>
  );
}
