import { Chip } from "@/ui";

export default function ChipBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      <Chip variant="outline">outline</Chip>
      <Chip variant="primary">primary</Chip>
      <Chip variant="success">success</Chip>
      <Chip variant="warning">warning</Chip>
      <Chip variant="danger">danger</Chip>
      <Chip variant="info">info</Chip>
    </div>
  );
}
