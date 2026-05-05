import { Button, Toaster } from "@/component";

export default function ToastWithDescription() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({
            title: "操作成功",
            description: "您的操作已成功完成",
          })
        }
      >
        With Description
      </Button>
    </div>
  );
}
