import { Radio } from "@/ui";

export default function RadioSegmentDemo() {
  return (
    <Radio.Group variant="segment" defaultValue="left">
      <Radio value="left" variant="segment" className="rounded-l-full">
        Left
      </Radio>
      <Radio value="center" variant="segment">
        Center
      </Radio>
      <Radio value="right" variant="segment" className="rounded-r-full">
        Right
      </Radio>
    </Radio.Group>
  );
}
