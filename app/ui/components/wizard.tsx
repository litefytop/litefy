"use client";
import * as React from "react";
import { Check, ChevronLeft, ChevronRight } from "./icons";
import { ButtonRoot } from "./button";
import { Pager } from "./pager";
import { Steps, type StepsClassNames, type StepsItemConfig, type StepsStyles } from "./steps";
export interface WizardProps extends Omit<React.ComponentProps<"div">, "className"> {
    steps: StepsItemConfig[];
    children: React.ReactNode[];
    onFinish?: () => void;
    nextLabel?: React.ReactNode;
    backLabel?: React.ReactNode;
    finishLabel?: React.ReactNode;
    className?: string;
    classNames?: {
        steps?: string;
        pager?: string;
        footer?: string;
        button?: string;
        primaryButton?: string;
    };
    stepsClassNames?: StepsClassNames;
    stepsStyles?: StepsStyles;
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
export function useWizardNavigation({ count, defaultIndex = 0, index: controlledIndex, maxIndex, onIndexChange, }: WizardNavigationOptions): WizardNavigation {
    const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
    const [maxVisited, setMaxVisited] = React.useState(defaultIndex);
    const isControlled = controlledIndex !== undefined;
    const index = isControlled ? controlledIndex : internalIndex;
    const maxReachable = Math.min(maxIndex ?? count - 1, count - 1);
    const go = React.useCallback((next: number) => {
        const clamped = Math.max(0, Math.min(count - 1, next));
        if (clamped > maxReachable)
            return;
        if (!isControlled)
            setInternalIndex(clamped);
        setMaxVisited((m) => Math.max(m, clamped));
        onIndexChange?.(clamped);
    }, [count, maxReachable, isControlled, onIndexChange]);
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
export function Wizard({ steps, children, onFinish, nextLabel = "Next", backLabel = "Back", finishLabel = "Submit", className, classNames, stepsClassNames, stepsStyles, ...props }: WizardProps) {
    const nav = useWizardNavigation({ count: steps.length });
    return (<div {...props} className={className}>
      <Steps items={steps} index={nav.index} maxIndex={nav.maxVisited} onChange={nav.go} className={classNames?.steps} classNames={stepsClassNames} styles={stepsStyles}/>
      <Pager index={nav.index} onChange={nav.go} transition="slide" gesture={false} className={classNames?.pager}>
        {children}
      </Pager>
      <div className={classNames?.footer}>
        <ButtonRoot className={classNames?.button} disabled={nav.isFirst} onClick={() => nav.go(nav.index - 1)}>
          {backLabel}
        </ButtonRoot>
        {nav.isLast ? (<ButtonRoot className={classNames?.primaryButton} onClick={onFinish}>
            {finishLabel}
          </ButtonRoot>) : (<ButtonRoot className={classNames?.primaryButton} onClick={() => nav.go(nav.index + 1)}>
            {nextLabel}
          </ButtonRoot>)}
      </div>
    </div>);
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
    className?: string;
    classNames?: StepsClassNames & {
        content?: string;
        footer?: string;
        button?: string;
        primaryButton?: string;
    };
    styles?: {
        content?: React.CSSProperties;
    };
}
export function InlineWizard({ steps, defaultIndex = 0, index: controlledIndex, onFinish, onIndexChange, maxIndex, nextLabel = "Continue", backLabel = "Back", finishLabel = "Finish", disabled, className, classNames, styles, }: InlineWizardProps) {
    const nav = useWizardNavigation({
        count: steps.length,
        defaultIndex,
        index: controlledIndex,
        maxIndex,
        onIndexChange,
    });
    const go = (next: number) => {
        if (!disabled)
            nav.go(next);
    };
    return (<Steps orientation="vertical" index={nav.index} maxIndex={nav.maxVisited} onChange={(i) => go(i)} className={className} classNames={classNames} items={steps.map((step, i) => ({
            title: step.title,
            description: step.description,
            content: i === nav.index ? (<>
              <div className={classNames?.content} style={styles?.content}>
                {step.content}
              </div>
              <div className={classNames?.footer}>
                {i > 0 && (<ButtonRoot className={classNames?.button} disabled={disabled} onClick={() => go(i - 1)}>
                    <ChevronLeft/>
                    {backLabel}
                  </ButtonRoot>)}
                {i === steps.length - 1 ? (<ButtonRoot className={classNames?.primaryButton} disabled={disabled} onClick={onFinish}>
                    {finishLabel}
                    {onFinish && <Check/>}
                  </ButtonRoot>) : (<ButtonRoot className={classNames?.primaryButton} disabled={disabled} onClick={() => go(i + 1)}>
                    {nextLabel}
                    <ChevronRight/>
                  </ButtonRoot>)}
              </div>
            </>) : undefined,
        }))}/>);
}
