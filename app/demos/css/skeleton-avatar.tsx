export default function SkeletonAvatarDemo() {
  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <div className="skeleton h-12 w-12 shrink-0 rounded-full" />
      <div className="flex w-full flex-col gap-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
