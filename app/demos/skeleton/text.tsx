export default function SkeletonTextDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-11/12" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-4 w-3/5" />
    </div>
  );
}
