export default function CardGroupDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="card p-5">
        <div className="text-muted-foreground text-xs uppercase tracking-wider">
          Revenue
        </div>
        <div className="mt-2 text-2xl font-semibold">$12,480</div>
        <div className="text-muted-foreground mt-1 text-xs">
          +12.4% from last week
        </div>
      </div>
      <div className="card p-5">
        <div className="text-muted-foreground text-xs uppercase tracking-wider">
          Active users
        </div>
        <div className="mt-2 text-2xl font-semibold">3,219</div>
        <div className="text-muted-foreground mt-1 text-xs">
          +5.1% from last week
        </div>
      </div>
    </div>
  );
}
