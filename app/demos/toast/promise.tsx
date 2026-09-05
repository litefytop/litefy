"use client";
import { Button, Toaster } from "@/ui";

function deploy(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Deployed to production");
    }, 2000);
  });
}

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Toaster />
      <Button
        onClick={() =>
          Toaster.promise(deploy, {
            loading: "Deploying...",
            success: (message) => message,
            error: () => "Deployment failed, please retry.",
          })
        }
      >
        Start Deploy
      </Button>
    </div>
  );
}
