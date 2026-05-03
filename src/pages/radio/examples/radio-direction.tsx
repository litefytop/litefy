import { Radio } from "@/component";

export default function RadioDirection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">horizontal (default)</p>
        <Radio.Group direction="horizontal">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
        </Radio.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">vertical</p>
        <Radio.Group direction="vertical">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
