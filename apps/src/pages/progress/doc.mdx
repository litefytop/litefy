# Progress

A progress bar component supporting static progress and checkpoint-based dynamic progress.

## Installation

```tsx
import { Progress } from "@/component";
```

## Examples

### Basic

```tsx
import { Progress } from "@/component";

export default function ProgressBasic() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">0%</p>
        <Progress value={0} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">25%</p>
        <Progress value={0.25} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">50%</p>
        <Progress value={0.5} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">75%</p>
        <Progress value={0.75} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">100%</p>
        <Progress value={1} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Reverse</p>
        <Progress value={0.5} reverse />
      </div>
    </div>
  );
}
```

### Dynamic

```tsx
import { Progress, Button } from "@/component";
import { useState, useEffect, useRef } from "react";
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
```

## API Reference

### Progress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Static progress value (between 0-1) |
| `getCurrent` | `() => number \| Promise<number>` | - | Function to get current progress |
| `totalDuration` | `number` | `5` | Estimated total duration in seconds |
| `checkpoints` | `number[]` | `[0.25, 0.5, 0.75, 1]` | Checkpoints for triggering progress updates |
| `reverse` | `boolean` | `false` | Display from right to left |
| `transitionDuration` | `number` | `0.2` | Transition duration in seconds |
| `className` | `ClassNameValue` | - | Root container className |
| `barClassName` | `ClassNameValue` | - | Progress bar className |
| `rootProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Root container HTML attributes |
| `barProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Progress bar HTML attributes |
| `onComplete` | `() => void` | - | Callback when progress completes |
