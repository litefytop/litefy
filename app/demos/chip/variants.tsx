import { Chip } from "@/ui";

export default function ChipVariantsDemo() {
  return (
    <div className="flex items-center gap-3">
      <Chip>
        <a href="#" className="text-current no-underline">link chip</a>
      </Chip>
      <Chip variant="success">
        <button type="button" className="cursor-pointer">button chip</button>
      </Chip>
    </div>
  );
}
