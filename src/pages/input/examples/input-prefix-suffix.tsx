import { Input } from "@/components";

export default function InputPrefixSuffix() {
  return (
    <div className="space-y-4 w-80">
      <Input leading={<span className="text-muted-foreground">🔍</span>} placeholder="搜索内容" />
      <Input trailing=".com" placeholder="请输入域名" />
      <Input leading="https://" trailing=".com" placeholder="请输入域名" />
    </div>
  );
}
