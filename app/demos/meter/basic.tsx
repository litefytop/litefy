import { Meter } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full max-w-96 flex-col items-center gap-2 text-center">
      <p className="text-sm text-surface-fg">Default thresholds — low 20 / high 60 / optimum 80</p>
      <Meter aria-label="Critical level" value={10} />
      <Meter aria-label="Elevated level" value={30} />
      <Meter aria-label="Healthy level" value={70} />
    </div>
  );
}
