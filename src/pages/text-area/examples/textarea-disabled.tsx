import { Textarea } from "@/component/ui/text-area";

export function TextareaDisabled() {
  return (
    <Textarea
      label="禁用文本域"
      defaultValue="这是一个禁用的文本域"
      disabled
      description="禁用状态下无法编辑"
    />
  );
}
