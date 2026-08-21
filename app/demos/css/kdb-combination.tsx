export default function KdbCombinationDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <kbd className="kdb">⌘</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kdb">Shift</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kdb">P</kbd>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="kdb">Ctrl</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kdb">C</kbd>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="kdb">⌘</kbd>
        <span className="text-muted-foreground text-sm">+</span>
        <kbd className="kdb">K</kbd>
      </div>
    </div>
  );
}
