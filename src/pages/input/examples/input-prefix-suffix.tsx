import { Input } from "@/component";

export default function InputPrefixSuffix() {
  return (
    <div className="space-y-4 w-80">
      <Input label="Search" leading={<span className="text-muted-foreground">🔍</span>} placeholder="Search..." />
      <Input label="Domain" trailing=".com" placeholder="Enter domain" />
      <Input label="URL" leading="https://" trailing=".com" placeholder="Enter domain" type="url" />
    </div>
  );
}
