import { Radio } from "@/component";
import { useState } from "react";

export default function RadioValidation() {
  const [controlledValue, setControlledValue] = useState<string>("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Controlled (Valid/Invalid options)</p>
        <Radio
          value={controlledValue}
          onValueChange={(value) => {
            setControlledValue(value);
            if (value === "invalid") {
              return { invalid: "This option is not allowed" };
            }
          }}
          options={[
            {
              value: "valid",
              label: "Valid",
            },
            {
              value: "invalid",
              label: "Invalid",
            },
          ]}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Uncontrolled (Valid/Invalid options)</p>
        <Radio
          onValueChange={(value) => {
            if (value === "invalid") {
              return { invalid: "This option is not allowed" };
            }
          }}
          options={[
            {
              value: "valid",
              label: "Valid",
              variant: "segment",
              className: "rounded-l-full",
            },
            {
              value: "invalid",
              label: "Invalid",
              variant: "segment",
              className: "rounded-r-full",
            },
          ]}
        />
      </div>
    </div>
  );
}
