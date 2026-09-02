export default function CardBasicDemo() {
  return (
    <div className="card w-full max-w-sm p-6">
      <h3 className="text-lg font-semibold">Litefy Card</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        A glassmorphic surface with subtle border, soft shadow and a glow that
        fades in on hover.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          Action
        </button>
        <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
