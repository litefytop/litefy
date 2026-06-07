import { Button } from "@/component";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="text">Text</Button>
    </div>
  );
}
