import { ClockIcon } from "@/component";

interface ComingSoonProps {
  projectName?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ projectName = "新项目" }) => {
  return (
    <div className="max-w-md text-center p-8 m-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-4 py-3 flex items-center justify-center">
        <span className="w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ClockIcon className="h-6 w-6" />
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



