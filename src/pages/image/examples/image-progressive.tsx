import { useState } from "react";
import { Image } from "@/component/ui/image";
import { Button } from "@/component/ui/button";
import { RefreshCwIcon } from "lucide-react";

export function ImageProgressive() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row items-end gap-4">
      <Image
        key={reloadKey}
        src="https://picsum.photos/seed/3/800/400"
        placeholderSrc="https://picsum.photos/seed/3/100/100"
        delay={1000}
        alt="Random"
        className="w-40 h-40"
      />
      <Button onClick={handleReload} variant="outline" >
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
    </div>
  );
}
