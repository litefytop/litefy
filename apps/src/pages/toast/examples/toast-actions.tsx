import { Button, Toaster } from "@/component";

export default function ToastWithActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "Toast with Actions",
            actions: [
              {
                children: "View",
                onClick: (dismiss) => {
                  dismiss();
                },
              },
              {
                children: "Cancel",
                onClick: (dismiss) => {
                  dismiss();
                },
              },
            ],
          })
        }
      >
        With Actions
      </Button>
    </div>
  );
}
