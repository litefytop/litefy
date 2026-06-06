import { Button, Toaster } from "@/component";

export default function ToastWithDescription() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "Success",
            description: "Your action has been completed successfully",
          })
        }
      >
        With Description
      </Button>
    </div>
  );
}
