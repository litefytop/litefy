import { useState } from "react";
import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Invalid Option", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function SelectValidation() {
  const [invalid, setInvalid] = useState<string>();

  return (
      <Select
        options={options}
        placeholder="Select with validation"
        label="Required"
        invalid={invalid}
        onChange={(e) => {
          if (e.target.value === "2") {
            setInvalid("Invalid Option is not allowed");
          } else {
            setInvalid(undefined);
          }
        }}
      />
    
  );
}
