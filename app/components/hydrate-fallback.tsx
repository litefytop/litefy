export function HydrateFallback() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <header className="flex items-center justify-between">
          <div className="block rounded-md bg-accent motion-safe:animate-pulse h-8 w-32" />
          <div className="flex gap-4">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-8 w-20" />
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-8 w-20" />
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <aside className="flex flex-col gap-4">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-6 w-24" />
            <div className="flex flex-col gap-2">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4 w-3/4" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4 w-1/2" />
            </div>
          </aside>
          <section className="flex flex-col gap-6 md:col-span-3">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-8 w-3/4" />
            <div className="flex flex-col gap-3">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-4 w-2/3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-40" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-40" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
