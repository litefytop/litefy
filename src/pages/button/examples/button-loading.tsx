import { Button } from "@/component";
import { useState } from "react";

export default function ButtonLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleClick} loading={{ loading: isLoading }}>
        {isLoading ? "Loading..." : "Click to Load"}
      </Button>
    </div>
  );
}
