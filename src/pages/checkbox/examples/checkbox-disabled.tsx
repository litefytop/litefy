import { Checkbox } from "@/components";

export default function CheckboxDisabled() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">组禁用</p>
        <Checkbox.Group disabled>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </Checkbox.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">单个禁用</p>
        <Checkbox.Group>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana" disabled>Banana</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  );
}
