import { Checkbox } from "@/component";

export default function CheckboxBasic() {
  return (
    <Checkbox
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
  );
}
