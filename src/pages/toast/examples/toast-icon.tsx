import { Button, Toaster } from "@/component";

export default function ToastWithIcon() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "自定义图标",
            icon: <span>🎉</span>,
          })
        }
      >
        Custom Icon
      </Button>
    </div>
  );
}
