import { Paper } from "@/ui";

export default function PaperBasicDemo() {
  return (
    <div className="w-full overflow-auto py-4">
      <Paper>
        <div className="flex items-baseline justify-between border-b pb-3">
          <h3 className="text-lg font-semibold">Litefy UI</h3>
          <span className="text-xs text-muted-foreground">2026-08-31</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The paper is a print-ready page surface with a fixed A5 size and a page break after each
          sheet when printing.
        </p>
        <div className="mt-6 space-y-2">
          <div className="h-2 w-3/4 rounded bg-muted" />
          <div className="h-2 w-1/2 rounded bg-muted" />
          <div className="h-2 w-5/6 rounded bg-muted" />
          <div className="h-2 w-2/3 rounded bg-muted" />
        </div>
      </Paper>
    </div>
  );
}
