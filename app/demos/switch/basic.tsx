import { Switch } from "@/ui";

export default function SwitchBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch defaultChecked>Enable notifications</Switch>
      <Switch>Enable dark mode</Switch>
    </div>
  );
}
