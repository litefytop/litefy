import { Button, Toaster } from "@/component";

export default function ToastWithCallbacks() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "带回调",
            onDismiss: (toast) => {
              console.log("dismissed", toast);
            },
            onAutoClose: (toast) => {
              console.log("auto closed", toast);
            },
          })
        }
      >
        With Callbacks
      </Button>
    </div>
  );
}
