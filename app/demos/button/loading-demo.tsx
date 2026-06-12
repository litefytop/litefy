"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button loadingConfig={{ loading }} onClick={handleClick}>
        Click Me
      </Button>
      <Button variant="destructive" loadingConfig={{ loading }} onClick={handleClick}>
        Delete
      </Button>
      <Button variant="outline" loadingConfig={{ loading }} onClick={handleClick}>
        Submit
      </Button>
    </div>
  );
}