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
        src="/logo-hd.png"
        placeholderSrc="/logo-thumb.png"
        delay={1000}
        alt="Logo"
        className="w-40 h-40"
      />
      <Button onClick={handleReload} variant="outline" >
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
    </div>
  );
}
