import { Button, Toaster } from "@/component";

export default function ToastTypes() {
  const handlePromise = () => {
    Toaster.promise(
      () =>
        new Promise<{ name: string }>((resolve) => {
          setTimeout(() => resolve({ name: "Event" }), 2000);
        }),
      {
        loading: "Loading...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => Toaster.success({ title: "Success" })}>
        Success
      </Button>
      <Button onClick={() => Toaster.error({ title: "Error" })}>
        Error
      </Button>
      <Button onClick={() => Toaster.warning({ title: "Warning" })}>
        Warning
      </Button>
      <Button onClick={() => Toaster.info({ title: "Info" })}>
        Info
      </Button>
      <Button onClick={handlePromise}>Promise</Button>
    </div>
  );
}
