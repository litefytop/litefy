import { Switch } from "@/ui";

export default function SwitchDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch disabled>Disabled (off)</Switch>
      <Switch disabled defaultChecked>
        Disabled (on)
      </Switch>
    </div>
  );
}
