import { Image } from "@/component/ui/image";
import { RefreshCwIcon } from "lucide-react";

export function ImageFailure() {
  return (
    <div className="flex flex-row items-end gap-4">
      <figure>
        <Image
          src="/nonexistent.jpg"
          alt="Failure example"
          className="w-32 h-32"
        />
        <figcaption className="text-sm text-muted-foreground text-center">Default fallback</figcaption>
      </figure>
      <figure>
        <Image
          src="/nonexistent.jpg"
          alt="Failure example with custom fallback"
          className="w-32 h-32"
          fallback={
            <div className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
              <RefreshCwIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Failed to load
              </span>
            </div>
          }
        />
        <figcaption className="text-sm text-muted-foreground text-center">Custom fallback</figcaption>
      </figure>
    </div>
  );
}
