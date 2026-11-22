"use client";
import { Button, Toaster } from "@/ui/skins";

function deploy(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Deployed to production");
    }, 2000);
  });
}

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          data-variant="outline"
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
          data-variant="outline"
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
          data-variant="outline"
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
          data-variant="outline"
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
          data-variant="outline"
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
        <Button
          data-variant="outline"
          onClick={() =>
            Toaster.promise(deploy, {
              loading: "Deploying...",
              success: (message) => message,
              error: () => "Deployment failed, please retry.",
            })
          }
        >
          Promise
        </Button>
      </div>
    </div>
  );
}
