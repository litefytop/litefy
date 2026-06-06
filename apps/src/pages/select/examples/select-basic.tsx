import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function SelectBasic() {
  return (

      <Select options={options} placeholder="Select an option"  />

  );
}
