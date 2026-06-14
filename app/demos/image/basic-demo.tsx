"use client";

import { RefreshCwIcon } from "lucide-react";
import React from "react";
import { Button, Image } from "@/components/ui";

export default function ImageLoadingDemo() {
  const [reloadKey, setReloadKey] = React.useState(0);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col gap-4">
      <Image
        key={reloadKey}
        src="https://picsum.photos/seed/1/800/400"
        alt="Random landscape image"
      />
      <Button onClick={handleReload} variant="outline">
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
    </div>
  );
}
