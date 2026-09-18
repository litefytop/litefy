"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Button } from "./button";
import { Pager } from "./pager";
import { Steps, type StepsItemConfig } from "./steps";

export interface WizardProps
  extends Omit<React.ComponentProps<"div">, "className"> {
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
  ...props
}: WizardProps) {
  const nav = useWizardNavigation({ count: steps.length });

  return (
    <div {...props} className={cn("w-full space-y-6", className)}>
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
        <Button
          variant="outline"
          className="h-9 px-4 text-muted-foreground hover:bg-muted"
          disabled={nav.isFirst}
          onClick={() => nav.go(nav.index - 1)}
        >
          Back
        </Button>
        {nav.isLast ? (
          <Button className="h-9 px-4" onClick={onFinish}>
            Submit
          </Button>
        ) : (
          <Button className="h-9 px-4" onClick={() => nav.go(nav.index + 1)}>
            Next
          </Button>
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
                  <Button
                    variant="outline"
                    className={cn("text-muted-foreground", classNames?.button)}
                    disabled={disabled}
                    onClick={() => go(i - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    {backLabel}
                  </Button>
                )}
                {i === steps.length - 1 ? (
                  <Button
                    className={classNames?.primaryButton}
                    disabled={disabled}
                    onClick={onFinish}
                  >
                    {finishLabel}
                    {onFinish && <Check className="size-4" />}
                  </Button>
                ) : (
                  <Button
                    className={classNames?.primaryButton}
                    disabled={disabled}
                    onClick={() => go(i + 1)}
                  >
                    {nextLabel}
                    <ChevronRight className="size-4" />
                  </Button>
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
