import { Loading, Button } from "@/component";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function LoadingCustom() {
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const handleStart = () => {
    setLoading(true);
  };

  const handleStop = () => {
    setLoading(false);
  };
  const handleReset = () => {
    setHidden(true);
    setLoading(true);
    setTimeout(() => setHidden(false), 300);
  };

  return (
    <div className="space-y-4">
      <div className="h-48 border rounded-lg">
        {hidden ? null : (
            <Loading
          loading={loading}
          skeleton={
            <div className="space-y-3 p-4">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
            </div>
          }
          fallback={
            <div className="flex flex-col items-center gap-2">
              <LoaderCircle className="size-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          }
        >
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold">Data Content</h3>
            <p className="text-sm text-muted-foreground">
              This is the actual content that will be displayed after loading
              completes.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Item 1
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Item 2
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Item 3
              </span>
            </div>
          </div>
        </Loading>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={loading}>Start Loading</Button>
        <Button onClick={handleStop} disabled={!loading}>Stop Loading</Button>
        <Button onClick={handleReset} disabled={loading}>Reset Loading</Button>
      </div>
    </div>
  );
}
