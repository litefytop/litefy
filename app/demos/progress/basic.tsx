"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Progress } from "@/ui/skins";

const UNITS = 12;
const POLL_MS = 1000;

type Phase = "idle" | "running" | "paused" | "complete" | "aborted";

export default function Demo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const doneRef = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    const step = () => {
      doneRef.current += 1;
      if (doneRef.current >= UNITS) {
        setPhase("complete");
        return;
      }
      timer = window.setTimeout(step, 250 + Math.random() * 1250);
    };
    let timer = window.setTimeout(step, 250 + Math.random() * 1250);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(
      () => setShown(Math.round((doneRef.current / UNITS) * 100)),
      POLL_MS,
    );
    return () => window.clearInterval(id);
  }, [phase]);

  const start = () => {
    doneRef.current = 0;
    setShown(0);
    setPhase("running");
  };

  const abort = () => setPhase("aborted");

  const pause = () => setPhase("paused");
  const resume = () => setPhase("running");

  const reset = () => {
    doneRef.current = 0;
    setShown(0);
    setPhase("idle");
  };

  return (
    <div className="flex w-full flex-col flex-1 items-center justify-center gap-3 text-center">
      <Progress
        aria-label="Task progress"
        current={shown}
        isAbort={phase === "aborted"}
        isComplete={phase === "complete"}
        paused={phase === "paused"}
        data-variant="meter"
        className="w-full"
      />
      <p className="text-foreground">
        {phase === "idle" && "Idle"}
        {phase === "running" && `Running — ${shown}% polled once a second`}
        {phase === "complete" && "Complete"}
        {phase === "aborted" && `Aborted at ${shown}%`}
        {phase === "paused" && `Paused at ${shown}%`}
      </p>
      <div className="flex flex-wrap gap-3">
        {phase === "running" && (
          <>
            <Button onClick={pause}>Pause</Button>
            <Button onClick={abort}>Abort</Button>
          </>
        )}
        {phase === "paused" && (
          <>
            <Button onClick={resume}>Resume</Button>
            <Button onClick={abort}>Abort</Button>
          </>
        )}
        {phase === "idle" && <Button onClick={start}>Start</Button>}
        {phase !== "idle" && <Button data-variant="outline" onClick={reset}>Reset</Button>}
      </div>
    </div>
  );
}
