import { Button, Toaster } from "@/component";

export default function ToastDuration() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() => Toaster.success({ title: "5秒后消失", duration: 5000 })}
      >
        5s Duration
      </Button>
      <Button
        onClick={() =>
          Toaster.success({ title: "不会自动消失", duration: Infinity })
        }
      >
        Infinite
      </Button>
    </div>
  );
}
