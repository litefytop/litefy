import { Checkbox } from "@/components";

export default function CheckboxDirection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">horizontal (默认)</p>
        <Checkbox.Group direction="horizontal">
          <Checkbox value="option1">选项一</Checkbox>
          <Checkbox value="option2">选项二</Checkbox>
          <Checkbox value="option3">选项三</Checkbox>
        </Checkbox.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">vertical</p>
        <Checkbox.Group direction="vertical">
          <Checkbox value="option1">选项一</Checkbox>
          <Checkbox value="option2">选项二</Checkbox>
          <Checkbox value="option3">选项三</Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  );
}
