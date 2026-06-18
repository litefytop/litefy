"use client";

import * as React from "react";
import { NumberField } from "@/ui";

export default function NumberFieldControlledDemo() {
  const [stringValue, setStringValue] = React.useState<string | undefined>(
    "50",
  );
  const [numberValue, setNumberValue] = React.useState<number | undefined>(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Normal Mode (string value)</p>
        <NumberField
          value={stringValue}
          onValueChange={setStringValue}
          min={0}
          max={100}
          step={0.5}
        />
        <p className="text-sm text-muted-foreground">
          Value: {stringValue} (type: {typeof stringValue})
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          Positive Integer Mode (number | null value)
        </p>
        <NumberField
          value={numberValue}
          onValueChange={setNumberValue}
          positiveInteger
          min={0}
          max={20}
        />
        <p className="text-sm text-muted-foreground">
          Value: {numberValue} (type:{" "}
          {numberValue === null ? "null" : typeof numberValue})
        </p>
      </div>
    </div>
  );
}
