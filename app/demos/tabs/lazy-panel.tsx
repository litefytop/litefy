export default function LazySettingsPanel() {
  return (
    <div className="p-4 text-sm text-muted-foreground">
      Settings panel — this chunk is loaded on demand via React.lazy.
    </div>
  );
}
