import { Button, Toaster } from "@/component";

export default function ToastDismiss() {
  const handleDismiss = () => {
    Toaster.success({ title: "操作成功" });
    setTimeout(() => {
      Toaster.dismiss();
    }, 1000);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={handleDismiss}>Dismiss After 1s</Button>
      <Button onClick={() => Toaster.dismiss()}>Dismiss All</Button>
    </div>
  );
}
