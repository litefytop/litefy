import { Separator } from "@/component";

export default function SeparatorVertical() {
  return (
    <div className="flex h-20 items-center space-x-4">
      <div className="font-medium">Left</div>
      <Separator orientation="vertical" />
      <div className="text-muted-foreground">Center content</div>
      <Separator orientation="vertical" />
      <div className="font-medium">Right</div>
    </div>
  );
}
