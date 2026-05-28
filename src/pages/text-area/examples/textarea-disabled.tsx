import { Textarea } from "@/component/ui/text-area";

export function TextareaDisabled() {
  return (
    <Textarea

      defaultValue="这是一个禁用的文本域"
      disabled
 
    />
  );
}
