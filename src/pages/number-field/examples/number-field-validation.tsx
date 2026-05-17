import { useState } from "react";
import { NumberField } from "@/component/ui/number-field";

export function NumberFieldValidation() {
  const [value] = useState(5);
  const [invalid, setInvalid] = useState<string>();

  const handleChange = (val: number) => {
    // 示例：偶数才有效
    if (val % 2 !== 0) {
      return { invalid: "请输入偶数" };
    }
    setInvalid(undefined);
  };

  return (
    <>
      <div className="mb-2 text-sm text-muted-foreground">
        <p>当前值：{value} {invalid && <span className="text-destructive">- {invalid}</span>}</p>
      </div>
      <NumberField
        label="校验（自定义规则）"
        description="请输入偶数"
        value={value}
        onValueChange={handleChange}
        invalid={invalid}
        min={0}
        max={10}
      />
      <div className="mt-4">
        <NumberField
          label="自动范围校验"
          description="最小值 0，最大值 10"
          min={0}
          max={10}
          defaultValue={5}
        />
      </div>
    </>
  );
}
