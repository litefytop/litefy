import { Checkbox } from "@/component";

export default function CheckboxDirection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">horizontal (default)</p>
        <Checkbox.Group direction="horizontal">
          <Checkbox value="option1">Option 1</Checkbox>
          <Checkbox value="option2">Option 2</Checkbox>
          <Checkbox value="option3">Option 3</Checkbox>
        </Checkbox.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">vertical</p>
        <Checkbox.Group direction="vertical">
          <Checkbox value="option1">Option 1</Checkbox>
          <Checkbox value="option2">Option 2</Checkbox>
          <Checkbox value="option3">Option 3</Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  );
}
