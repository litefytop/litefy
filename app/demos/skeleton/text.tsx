import { Skeleton } from "@/ui";

export default function SkeletonTextDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}
