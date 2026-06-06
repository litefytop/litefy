import { Progress } from "@/component";

export default function ProgressBasic() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">0%</p>
        <Progress value={0} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">25%</p>
        <Progress value={0.25} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">50%</p>
        <Progress value={0.5} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">75%</p>
        <Progress value={0.75} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">100%</p>
        <Progress value={1} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Reverse</p>
        <Progress value={0.5} reverse />
      </div>
    </div>
  );
}
