export default function KbdCombinationDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <kbd className="kbd">⌘</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kbd">Shift</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kbd">P</kbd>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="kbd">Ctrl</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kbd">C</kbd>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="kbd">⌘</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kbd">K</kbd>
      </div>
    </div>
  );
}
