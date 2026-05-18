import { Textarea } from "@/component/ui/text-area";

export function TextareaBasic() {
  return (
    <Textarea
      label="反馈内容"
      placeholder="请输入您的反馈意见"
      description="请详细描述您遇到的问题或建议"
    />
  );
}
