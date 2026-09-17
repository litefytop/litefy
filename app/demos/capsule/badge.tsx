import { Capsule, Chip } from "@/ui";

export default function CapsuleBadgeDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <Capsule>
          <Chip variant="primary">build</Chip>
          <Chip variant="success">passing</Chip>
        </Capsule>
        <Capsule>
          <Chip variant="primary">npm</Chip>
          <Chip variant="danger">v1.2.3</Chip>
        </Capsule>
        <Capsule>
          <Chip variant="primary">license</Chip>
          <Chip variant="info">MIT</Chip>
        </Capsule>
      </div>
      <Capsule>
        <Chip variant="primary">docs</Chip>
        <Chip variant="warning">litefy.dev</Chip>
      </Capsule>
    </div>
  );
}
