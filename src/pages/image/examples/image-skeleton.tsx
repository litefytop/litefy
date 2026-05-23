import { Button } from "@/component";
import { Image } from "@/component/ui/image";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export function ImageSkeleton() {
  const [reloadKey, setReloadKey] = useState(0);
  const [reloadKey1, setReloadKey1] = useState(0);

  return (
    <div className="flex  items-end gap-4">
      <figure>
        <Image
          key={reloadKey}
          src="/logo.svg"
          alt="Logo"
          className="w-20 h-20 p-1"
          delay={1000}
        />
        <figcaption className="text-sm text-muted-foreground text-center">
          Default Skeleton
        </figcaption>
      </figure>
      <Button
        onClick={() => setReloadKey((prev) => prev + 1)}
        variant="outline"
      >
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
      <figure>
        <Image
          delay={1000}
          key={reloadKey1}
          src="/logo.svg"
          alt="Logo"
          skeleton={
            <div className="size-20 animate-pulse bg-muted flex items-center justify-center text-xs">
              Loading...
            </div>
          }
          className="w-20 h-20 p-1"
        />
        <figcaption className="text-sm text-muted-foreground text-center">
          Custom Skeleton
        </figcaption>
      </figure>
      <Button
        onClick={() => setReloadKey1((prev) => prev + 1)}
        variant="outline"
      >
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
    </div>
  );
}
