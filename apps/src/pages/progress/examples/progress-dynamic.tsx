import { Progress } from "@/component";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/component";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function ProgressDynamic() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (isRunning || downloadProgress >= 1) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          return 1;
        }
        const increment = Math.random() * 0.3;
        const next = prev + increment;
        return next >= 1 ? 1 : next;
      });
    }, 500);
  };

  const pauseProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const restartProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDownloadProgress(0);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Download</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(downloadProgress * 100)}%
          </span>
        </div>
        <Progress
          getCurrent={() => downloadProgress}
          totalDuration={5}
          checkpoints={[0.25, 0.5, 0.75, 1]}
          onComplete={() => {
            console.log("Download complete");
            setIsRunning(false);
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={startProgress}
          disabled={isRunning || downloadProgress >= 1}
          variant="outline"
        >
          <Play className="size-4 mr-2" />
          Start
        </Button>
        <Button
          onClick={pauseProgress}
          disabled={!isRunning}
          variant="outline"
        >
          <Pause className="size-4 mr-2" />
          Pause
        </Button>
        <Button
          onClick={restartProgress}
          variant="outline"
        >
          <RotateCcw className="size-4 mr-2" />
          Restart
        </Button>
      </div>
    </div>
  );
}
