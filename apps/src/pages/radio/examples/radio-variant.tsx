import { Radio } from "@/component";

export default function RadioVariant() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">radio (default)</p>
        <Radio
          defaultValue="a"
          options={[
            {
              value: "a",
              label: "A",
            },
            {
              value: "b",
              label: "B",
            },
            {
              value: "c",
              label: "C",
            },
          ]}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">segment</p>
        <Radio
          defaultValue="a"
          variant="segment"
          options={[
            {
              value: "a",
              label: "A",
              className: "rounded-l-md rounded-tr-none rounded-br-none",
            },
            {
              value: "b",
              label: "B",
              className: "rounded-none",
            },
            {
              value: "c",
              label: "C",
              className: "rounded-r-md rounded-tl-none rounded-bl-none",
            },
          ]}
        />
      </div>
    </div>
  );
}
