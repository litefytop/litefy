import { RotateCcw } from "lucide-react";
import { Button, Input, Navigator, Select, useNavigator } from "@/ui";

export default function NavigatorBasicDemo() {
  const nav = useNavigator({
    fields: { keyword: "", status: "all" },
  });

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <Navigator title="Orders">
        <Input
          placeholder="Search keyword"
          value={nav.values.keyword}
          onChange={(e) => nav.setValue("keyword", e.target.value)}
          className="w-44"
        />
        <Select
          options={[
            { label: "All statuses", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
          ]}
          value={nav.values.status}
          onValueChange={(v) => nav.setValue("status", v)}
        />
        <Button variant="text" disabled={nav.activeCount === 0} onClick={nav.reset}>
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </Navigator>
      <p className="text-xs text-muted-foreground">
        {nav.activeCount} filter{nav.activeCount === 1 ? "" : "s"} active —{" "}
        {nav.activeKeys.join(", ") || "none"}
      </p>
    </div>
  );
}
