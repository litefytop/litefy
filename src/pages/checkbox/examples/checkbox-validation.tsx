import { Checkbox } from "@/component";
import { useState } from "react";

export default function CheckboxValidation() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Checkbox Validation"
        value={values}
        onValueChange={(values) => {
          setValues(values);
          if (!values.length) {
            return { invalid: "Please select at least one option" };
          }
        }}
        options={[
          {
            value: "remember",
            label: "Remember me",
          },
          {
            value: "agree",
            label: "Agree to terms",
          },
          {
            value: "news",
            label: "Subscribe to newsletter",
          },
        ]}
      />

      <Checkbox
        label="Toggle Validation"
        itemProps={{
          options: { variant: "toggle" },
        }}
        description="Here you can select multiple toggles"
        onValueChange={(values) => {
          if (!values.length) {
            return { invalid: true };
          }
        }}
        options={[
          {
            value: "a",
            label: "toggle A",
          },
          {
            value: "b",
            label: "toggle B",
          },
          {
            value: "c",
            label: "toggle C",
          },
        ]}
      />
    </div>
  );
}
