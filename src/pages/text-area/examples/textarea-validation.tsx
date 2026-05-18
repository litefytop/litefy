import { useState } from "react";
import { Textarea } from "@/component/ui/text-area";

export function TextareaValidation() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (newValue.length < 10) {
      setInvalid("内容至少需要 10 个字符");
    } else {
      setInvalid(undefined);
    }
  };

  return (
    <Textarea
      label="意见反馈"
      value={value}
      onChange={handleChange}
      invalid={invalid}
      placeholder="请输入至少 10 个字符的反馈内容"
    />
  );
}
