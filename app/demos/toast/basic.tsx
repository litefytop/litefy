"use client";
import { Button, Toaster } from "@/ui";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Toaster />
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() =>
            Toaster.success({
              title: "Changes saved",
              description: "Your profile has been updated.",
            })
          }
        >
          Success
        </Button>
        <Button
          onClick={() =>
            Toaster.error({
              title: "Upload failed",
              description: "The file exceeds the 10 MB limit.",
            })
          }
        >
          Error
        </Button>
        <Button
          onClick={() =>
            Toaster.warning({
              title: "Storage almost full",
              description: "9.2 GB of 10 GB used.",
            })
          }
        >
          Warning
        </Button>
        <Button
          onClick={() =>
            Toaster.info({
              title: "New version available",
              description: "Reload to update to v2.4.0.",
            })
          }
        >
          Info
        </Button>
        <Button
          onClick={() => {
            const id = Toaster.loading({ title: "Loading data..." });
            setTimeout(() => Toaster.dismiss(id), 3000);
          }}
        >
          Loading
        </Button>
        <Button
          onClick={() =>
            Toaster.info({
              title: "New version available",
              description: "Reload to update to v2.4.0.",
              closable: true,
            })
          }
        >
          Closable
        </Button>
      </div>
    </div>
  );
}
