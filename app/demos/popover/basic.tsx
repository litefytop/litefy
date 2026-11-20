import { Button, Popover } from "@/ui/skins";

function ActionList() {
  return (
    <div className="flex flex-col gap-1">
      {["Item 1", "Item 2", "Item 3"].map((label) => (
        <Button key={label} data-variant="text">
          {label}
        </Button>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Popover alignX="start" trigger="align start">
        <ActionList />
      </Popover>
      <Popover trigger="align center">
        <ActionList />
      </Popover>
      <Popover alignX="end" trigger="align end">
        <ActionList />
      </Popover>
    </div>
  );
}
