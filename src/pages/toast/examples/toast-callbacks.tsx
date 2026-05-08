import { Button, Toaster } from "@/component";

export default function ToastWithCallbacks() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "Check callbacks in console",
            onClose: (event) => {
              if (event.type === "auto") {
                console.log("⏰ Auto closed");
              } else if (event.type === "manual") {
                console.log("👆 Manually closed");
              } else if (event.type === "complete") {
                console.log("✅ Close complete");
              }
            },
          })
        }
      >
        With Callbacks
      </Button>
    </div>
  );
}
