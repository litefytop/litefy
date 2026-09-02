import { Skeleton } from "@/ui";

export default function SkeletonAvatarDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      <div className="w-full space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
