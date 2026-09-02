export default function TagBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="tag">default</span>
        <span className="tag bg-emerald-600 text-white">stable</span>
        <span className="tag bg-amber-500 text-white">beta</span>
        <span className="tag bg-red-600 text-white">deprecated</span>
        <span className="tag bg-sky-600 text-white">v2.0</span>
      </div>
      <div className="flex items-center gap-2">
        <a href="#" className="tag bg-violet-600 text-white">
          link tag
        </a>
        <button type="button" className="tag cursor-pointer bg-emerald-600 text-white">
          button tag
        </button>
      </div>
    </div>
  );
}
