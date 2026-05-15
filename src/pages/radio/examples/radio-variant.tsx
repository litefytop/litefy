import { Radio } from "@/component";

export default function RadioVariant() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">radio (default)</p>
        <Radio.Group
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
        <Radio.Group
          defaultValue="a"
          className="gap-0"
          options={[
            {
              value: "a",
              label: "A",
              variant: "segment",
              className: "rounded-l-md rounded-tr-none rounded-br-none",
            },
            {
              value: "b",
              label: "B",
              variant: "segment",
              className: "rounded-none",
            },
            {
              value: "c",
              label: "C",
              variant: "segment",
              className: "rounded-r-md rounded-tl-none rounded-bl-none",
            },
          ]}
        />
      </div>
    </div>
  );
}
