interface ComingSoonProps {
  projectName?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ projectName = "新项目" }) => {
  return (
    <div className="max-w-md text-center p-8 m-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-4 py-3 flex items-center justify-center">
        <span className="w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>
      <div className="p-4 flex flex-col gap-6">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {projectName}
        </h2>
        <p>功能开发中，敬请期待</p>
        <p>正在全力开发相关功能，后续将逐步上线</p>
      </div>
    </div>
  );
};

export default ComingSoon;
