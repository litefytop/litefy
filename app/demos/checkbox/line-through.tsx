import { CheckboxGroup } from "@/ui/skins";

export default function Demo() {
  return (
    <CheckboxGroup
      label="Tasks"
      common={{ lineThrough: true }}
      defaultValue={["design-review"]}
      options={[
        { label: "Finish the design review", value: "design-review" },
        { label: "Ship the release notes", value: "release-notes" },
        { label: "Review pull requests", value: "pull-requests" },
      ]}
    />
  );
}
