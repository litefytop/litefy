export default function CapsuleBadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="capsule">
          <span className="tag bg-neutral-600 text-white">build</span>
          <span className="tag bg-emerald-600 text-white">passing</span>
        </span>
        <span className="capsule">
          <span className="tag bg-neutral-600 text-white">npm</span>
          <span className="tag bg-red-600 text-white">v1.2.3</span>
        </span>
        <span className="capsule">
          <span className="tag bg-neutral-600 text-white">license</span>
          <span className="tag bg-sky-600 text-white">MIT</span>
        </span>
      </div>
      <a href="#" className="capsule">
        <span className="tag bg-neutral-600 text-white">docs</span>
        <span className="tag bg-violet-600 text-white">litefy.dev</span>
      </a>
    </div>
  );
}
