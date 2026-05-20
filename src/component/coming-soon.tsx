import { Clock } from "lucide-react";

interface ComingSoonProps {
  projectName?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ projectName = "New Project" }) => {
  return (
    <div className="max-w-md text-center p-8 m-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-4 py-3 flex items-center justify-center">
        <span className="w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Clock className="h-6 w-6" />
        </span>
      </div>
      <div className="p-4 flex flex-col gap-6">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {projectName}
        </h2>
        <p>Coming Soon</p>
        <p>We are working hard to bring you this feature. Stay tuned for updates.</p>
      </div>
    </div>
  );
};



