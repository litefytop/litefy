import { Button, Toaster } from "@/component";

export default function ToastDuration() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() => Toaster.success({ title: "Disappears in 5s", duration: 5000 })}
      >
        5s Duration
      </Button>
      <Button
        onClick={() =>
          Toaster.success({ title: "Won't auto dismiss", duration: Infinity })
        }
      >
        Infinite
      </Button>
    </div>
  );
}
