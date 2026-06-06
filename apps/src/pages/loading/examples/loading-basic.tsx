import { Loading, Button } from "@/component";
import { useState } from "react";

export default function LoadingBasic() {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleReset = () => {
    setHidden(true);
    setLoading(true);
    setTimeout(() => setHidden(false), 300);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="h-48 border rounded-lg">
        {hidden ? null : (
          <Loading loading={loading}>
            <div className="flex items-center justify-center h-full">
              <p>Content loaded successfully</p>
            </div>
          </Loading>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleReload} disabled={loading}>Reload Loading</Button>
        <Button onClick={handleReset} disabled={loading}>Reset Loading</Button>
      </div>
    </div>
  );
}
