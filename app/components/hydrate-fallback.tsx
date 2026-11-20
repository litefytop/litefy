export function HydrateFallback() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <header className="flex items-center justify-between">
          <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[2rem] w-[8rem]" />
          <div className="flex gap-4">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[2rem] w-[5rem]" />
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[2rem] w-[5rem]" />
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <aside className="flex flex-col gap-4">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1.5rem] w-[6rem]" />
            <div className="flex flex-col gap-2">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem]" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem] w-[75%]" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem] w-[50%]" />
            </div>
          </aside>
          <section className="flex flex-col gap-6 md:col-span-3">
            <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[2rem] w-[75%]" />
            <div className="flex flex-col gap-3">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem]" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem]" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1rem] w-[66%]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[10rem]" />
              <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[10rem]" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
