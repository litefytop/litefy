"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Pager } from "./pager";
import { Steps, type StepsItemConfig } from "./steps";

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

export interface WizardNavigationOptions {
  
  count: number;
  defaultIndex?: number;
  
  index?: number;
  
  maxIndex?: number;
  onIndexChange?: (index: number) => void;
}

export interface WizardNavigation {
  index: number;
  
  maxVisited: number;
  
  maxReachable: number;
  isFirst: boolean;
  isLast: boolean;
  isReachable: (target: number) => boolean;
  go: (next: number) => void;
}

export function useWizardNavigation({
  count,
  defaultIndex = 0,
  index: controlledIndex,
  maxIndex,
  onIndexChange,
}: WizardNavigationOptions): WizardNavigation {
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const [maxVisited, setMaxVisited] = React.useState(defaultIndex);
  const isControlled = controlledIndex !== undefined;
  const index = isControlled ? controlledIndex : internalIndex;
  const maxReachable = Math.min(maxIndex ?? count - 1, count - 1);

  const go = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      if (clamped > maxReachable) return;
      if (!isControlled) setInternalIndex(clamped);
      setMaxVisited((m) => Math.max(m, clamped));
      onIndexChange?.(clamped);
    },
    [count, maxReachable, isControlled, onIndexChange],
  );

  return {
    index,
    maxVisited,
    maxReachable,
    isFirst: index === 0,
    isLast: index === count - 1,
    isReachable: (target: number) => target <= maxReachable,
    go,
  };
}

export function Wizard({
  steps,
  children,
  onFinish,
  className,
  classNames,
}: WizardProps) {
  const nav = useWizardNavigation({ count: steps.length });

  return (
    <div className={cn("w-full space-y-6", className)}>
      <Steps
        items={steps}
        index={nav.index}
        maxIndex={nav.maxVisited}
        onChange={nav.go}
        className={classNames?.steps}
      />
      <Pager
        index={nav.index}
        onChange={nav.go}
        transition="view-transition"
        gesture={false}
        className={cn("h-48 w-full", classNames?.pager)}
      >
        {children}
      </Pager>
      <div className={cn("flex items-center justify-between", classNames?.footer)}>
        <button
          type="button"
          onClick={() => nav.go(nav.index - 1)}
          disabled={nav.isFirst}
          className="h-9 cursor-pointer rounded-md border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Back
        </button>
        {nav.isLast ? (
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
            onClick={() => nav.go(nav.index + 1)}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export interface InlineWizardStepConfig {
  title: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
}

export interface InlineWizardProps {
  steps: InlineWizardStepConfig[];
  defaultIndex?: number;
  index?: number;
  onFinish?: () => void;
  onIndexChange?: (index: number) => void;
  
  maxIndex?: number;
  nextLabel?: React.ReactNode;
  backLabel?: React.ReactNode;
  finishLabel?: React.ReactNode;
  disabled?: boolean;
  className?: ClassNameValue;
  classNames?: {
    marker?: ClassNameValue;
    title?: ClassNameValue;
    description?: ClassNameValue;
    connector?: ClassNameValue;
    content?: ClassNameValue;
    footer?: ClassNameValue;
    button?: ClassNameValue;
    primaryButton?: ClassNameValue;
  };
  styles?: {
    content?: React.CSSProperties;
  };
}

export function InlineWizard({
  steps,
  defaultIndex = 0,
  index: controlledIndex,
  onFinish,
  onIndexChange,
  maxIndex,
  nextLabel = "Continue",
  backLabel = "Back",
  finishLabel = "Finish",
  disabled,
  className,
  classNames,
  styles,
}: InlineWizardProps) {
  const nav = useWizardNavigation({
    count: steps.length,
    defaultIndex,
    index: controlledIndex,
    maxIndex,
    onIndexChange,
  });

  const go = (next: number) => {
    if (!disabled) nav.go(next);
  };

  const buttonBase =
    "inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

  return (
    <Steps
      orientation="vertical"
      index={nav.index}
      maxIndex={nav.maxVisited}
      onChange={(i) => go(i)}
      className={className}
      classNames={{
        marker: classNames?.marker,
        title: classNames?.title,
        description: classNames?.description,
        connector: classNames?.connector,
      }}
      items={steps.map((step, i) => ({
        title: step.title,
        description: step.description,
        content:
          i === nav.index ? (
            <>
              <div className={cn("text-sm", classNames?.content)} style={styles?.content}>
                {step.content}
              </div>
              <div
                className={cn("mt-3 flex items-center justify-end gap-2", classNames?.footer)}
              >
                {i > 0 && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => go(i - 1)}
                    className={cn(
                      buttonBase,
                      "border text-muted-foreground hover:bg-hover hover:text-foreground",
                      classNames?.button,
                    )}
                  >
                    <ChevronLeft className="size-4" />
                    {backLabel}
                  </button>
                )}
                {i === steps.length - 1 ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onFinish}
                    className={cn(
                      buttonBase,
                      "bg-primary text-primary-foreground hover:bg-primary-accent",
                      classNames?.primaryButton,
                    )}
                  >
                    {finishLabel}
                    {onFinish && <Check className="size-4" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => go(i + 1)}
                    className={cn(
                      buttonBase,
                      "bg-primary text-primary-foreground hover:bg-primary-accent",
                      classNames?.primaryButton,
                    )}
                  >
                    {nextLabel}
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </div>
            </>
          ) : undefined,
      }))}
    />
  );
}

Wizard.Inline = InlineWizard;

export interface WizardStatics {
  Inline: typeof InlineWizard;
}
