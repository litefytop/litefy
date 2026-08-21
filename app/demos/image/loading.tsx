"use client";

import { RefreshCwIcon } from "lucide-react";
import React from "react";
import { Button, Image } from "@/ui";

export default function ImageLoadingDemo() {
  const [reloadKey, setReloadKey] = React.useState(0);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col gap-4">
      <Image
        key={reloadKey}
        src="https://picsum.photos/seed/3/800/400"
        placeholderSrc="https://picsum.photos/seed/3/100/100"
        alt="Random image"
        className="w-40 h-40"
      />
      <Button onClick={handleReload} variant="outline">
        <RefreshCwIcon className="w-4 h-4" /> Reload
      </Button>
    </div>
  );
}
