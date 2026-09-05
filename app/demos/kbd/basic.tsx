import { Kbd } from "@/ui";

export default function KbdBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  );
}
