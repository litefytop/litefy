import { Button } from "@/components";

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="link" disabled>Link</Button>
      <Button variant="text" disabled>Text</Button>
    </div>
  );
}
