export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="flex gap-4">
            <div className="h-8 w-20 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1 space-y-4">
            <div className="h-6 w-24 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-40 rounded bg-muted" />
              <div className="h-40 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
