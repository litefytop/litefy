import { Kbd } from "@/ui";

export default function KbdCombinationDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </div>
      <div className="flex items-center gap-1">
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </div>
      <div className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
    </div>
  );
}
