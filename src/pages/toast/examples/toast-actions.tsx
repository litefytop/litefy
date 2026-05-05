import { Button, Toaster } from "@/component";

export default function ToastWithActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "有操作按钮",
            actions: [
              {
                children: "查看",
                onClick: (dismiss) => {
                  dismiss();
                },
              },
              {
                children: "取消",
                variant: "ghost",
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
