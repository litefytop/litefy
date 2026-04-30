import { Input } from "@/components";

export default function InputError() {
  return (
    <div className="space-y-4 w-80">
      <Input 
        label="邮箱"
        placeholder="请输入邮箱"
        error="请输入有效的邮箱地址"
      />
      <Input 
        label="邮箱"
        placeholder="请输入邮箱"
        invalid
      />
    </div>
  );
}
