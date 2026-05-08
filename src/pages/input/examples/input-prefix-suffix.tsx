import { Input } from "@/component";

export default function InputPrefixSuffix() {
  return (
    <div className="space-y-4 w-80">
      <Input leading={<span className="text-muted-foreground">🔍</span>} placeholder="Search..." />
      <Input trailing=".com" placeholder="Enter domain" />
      <Input leading="https://" trailing=".com" placeholder="Enter domain" />
    </div>
  );
}
