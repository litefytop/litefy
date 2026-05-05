import { Button, Toaster } from "@/component";

export default function ToastPosition() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          Toaster.success({ title: "右上角", description: "top-right" })
        }
      >
        Top Right
      </Button>
      <Button
        onClick={() =>
          Toaster.success({
            title: "左上角",
            description: "top-left",
          })
        }
      >
        Top Left
      </Button>
      <Button
        onClick={() =>
          Toaster.success({
            title: "顶部居中",
            description: "top-center",
          })
        }
      >
        Top Center
      </Button>
      <Button
        onClick={() =>
          Toaster.success({
            title: "右下角",
            description: "bottom-right",
          })
        }
      >
        Bottom Right
      </Button>
      <Button
        onClick={() =>
          Toaster.success({
            title: "左下角",
            description: "bottom-left",
          })
        }
      >
        Bottom Left
      </Button>
      <Button
        onClick={() =>
          Toaster.success({
            title: "底部居中",
            description: "bottom-center",
          })
        }
      >
        Bottom Center
      </Button>
    </div>
  );
}
