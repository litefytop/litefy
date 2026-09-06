"use client";

import * as React from "react";
import { type ClassNameValue, cn, Pager, Steps, type StepsItemConfig } from "..";

export interface WizardProps {
  steps: StepsItemConfig[];
  children: React.ReactNode[];
  onFinish?: () => void;
  className?: ClassNameValue;
  classNames?: {
    steps?: ClassNameValue;
    pager?: ClassNameValue;
    footer?: ClassNameValue;
  };
}

export function Wizard({
  steps,
  children,
  onFinish,
  className,
  classNames,
}: WizardProps) {
  const [index, setIndex] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  const go = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(steps.length - 1, next));
      setIndex(clamped);
      setMaxIndex((max) => Math.max(max, clamped));
    },
    [steps.length],
  );

  const isLast = index === steps.length - 1;

  return (
    <div className={cn("w-full space-y-6", className)}>
      <Steps
        items={steps}
        index={index}
        maxIndex={maxIndex}
        onChange={go}
        className={classNames?.steps}
      />
      <Pager
        index={index}
        onChange={go}
        transition="view-transition"
        gesture={false}
        className={cn("h-48 w-full", classNames?.pager)}
      >
        {children}
      </Pager>
      <div className={cn("flex items-center justify-between", classNames?.footer)}>
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="h-9 cursor-pointer rounded-md border bg-background px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Back
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={onFinish}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
