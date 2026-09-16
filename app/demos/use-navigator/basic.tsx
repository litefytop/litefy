import { useNavigator } from "@/ui";

export default function UseNavigatorDemo() {
  const nav = useNavigator({
    fields: { keyword: "", min: 0 },
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-md border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={nav.values.keyword}
          onChange={(e) => nav.setValue("keyword", e.target.value)}
          placeholder="Keyword"
          className="h-8 w-40 rounded-md border px-2 text-sm"
        />
        <input
          type="number"
          value={nav.values.min}
          onChange={(e) => nav.setValue("min", Number(e.target.value))}
          className="h-8 w-24 rounded-md border px-2 text-sm"
        />
        <button
          type="button"
          onClick={nav.reset}
          disabled={nav.activeCount === 0}
          className="h-8 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {nav.activeCount} active: {nav.activeKeys.join(", ") || "none"}
      </p>
    </div>
  );
}
