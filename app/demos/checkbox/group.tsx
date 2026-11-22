import { CheckboxGroup } from "@/ui/skins";

export default function Demo() {
  return (
    <CheckboxGroup
      label="Colors"
      defaultValue={["emerald"]}
      options={[
        { label: "Emerald", value: "emerald" },
        { label: "Cyan", value: "cyan" },
        { label: "Indigo", value: "indigo" },
      ]}
    />
  );
}
