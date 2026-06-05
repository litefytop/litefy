import { Button, Toaster } from "@/component";

export default function ToastWithIcon() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "Custom Icon",
            icon: <span>🎉</span>,
          })
        }
      >
        Custom Icon
      </Button>
    </div>
  );
}
