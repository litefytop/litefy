"use client";

import { useRef, useState } from "react";
import { Button, Progress } from "@/ui";

type Phase = "idle" | "running" | "complete" | "aborted";

export default function ProgressBasicDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [realProgress, setRealProgress] = useState(0);
  const taskRef = useRef({ progress: 0, startedAt: 0 });
  const simulateRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearSchedule = () => {
    if (simulateRef.current !== null) {
      window.clearInterval(simulateRef.current);
      simulateRef.current = null;
    }
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const complete = () => {
    clearSchedule();
    setPhase("complete");
  };

  const sample = () => {
    const elapsed = performance.now() - taskRef.current.startedAt;
    const progress = taskRef.current.progress;
    return { progress, elapsed, rate: progress / elapsed };
  };

  const start = () => {
    clearSchedule();
    taskRef.current = { progress: 0, startedAt: performance.now() };
    setCurrent(0);
    setDuration(0);
    setRealProgress(0);
    setPhase("running");

    simulateRef.current = window.setInterval(() => {
      taskRef.current.progress = Math.min(
        1,
        taskRef.current.progress + Math.random() * 0.02 + 0.005,
      );
    }, 100);

    const firstSampleTimer = window.setTimeout(() => {
      const { progress, elapsed, rate } = sample();
      if (progress >= 1) {
        complete();
        return;
      }
      const estimate = elapsed + (1 - progress) / rate;
      setCurrent(99.999);
      setDuration(estimate);

      [0.25, 0.5, 0.75].forEach((point) => {
        const id = window.setTimeout(() => {
          const next = sample();
          if (next.progress >= 1) {
            complete();
            return;
          }
          setRealProgress(next.progress);
          setDuration((1 - next.progress) / (next.progress / next.elapsed));
        }, estimate * point);
        timersRef.current.push(id);
      });

      const estimateTimer = window.setTimeout(() => {
        pollRef.current = window.setInterval(() => {
          setRealProgress(taskRef.current.progress);
          if (taskRef.current.progress >= 1) complete();
        }, 200);
      }, estimate);
      timersRef.current.push(estimateTimer);
    }, 1000);
    timersRef.current.push(firstSampleTimer);
  };

  const abort = () => {
    clearSchedule();
    setPhase("aborted");
  };

  const reset = () => {
    clearSchedule();
    setPhase("idle");
    setCurrent(0);
    setDuration(0);
    setRealProgress(0);
  };

  return (
    <div className="flex w-72 max-w-full flex-col gap-3">
      <Progress
        current={current}
        duration={duration}
        isAbort={phase === "aborted"}
        isComplete={phase === "complete"}
      />
      <p className="text-sm text-muted-foreground">
        {phase === "idle" && "Idle"}
        {phase === "running" &&
          `Running — UI target 99.999% / ${Math.round(duration / 100) / 10}s, backend ${Math.round(realProgress * 100)}%`}
        {phase === "complete" && "Complete"}
        {phase === "aborted" && "Aborted"}
      </p>
      <div className="flex gap-2">
        {phase === "running" ? (
          <Button className={[Button.className.base, Button.className.variant.danger]} onClick={abort}>
            Abort
          </Button>
        ) : (
          <Button
            className={[Button.className.base, Button.className.variant.primary]}
            disabled={phase === "complete"}
            onClick={start}
          >
            Start
          </Button>
        )}
        <Button className={[Button.className.base, Button.className.variant.outline]} onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
