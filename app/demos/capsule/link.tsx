import { Capsule, Chip } from "@/ui";

export default function CapsuleLinkDemo() {
  return (
    <a href="#">
      <Capsule>
        <Chip className="bg-neutral text-background">docs</Chip>
        <Chip className="bg-primary text-primary-foreground">litefy.dev</Chip>
      </Capsule>
    </a>
  );
}
