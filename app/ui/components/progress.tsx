import type * as React from "react";
export interface ProgressProps extends Omit<React.ComponentProps<"div">, "role"> {
    current: number;
    isAbort?: boolean;
    isComplete?: boolean;
    paused?: boolean;
    hideValue?: boolean;
    classNames?: {
        track?: string;
        fill?: string;
        value?: string;
    };
}
const valueStyle = (value: number): React.CSSProperties => ({
    ["--litefy-percent" as string]: value,
});
export function Progress({ current, isAbort, isComplete, paused, hideValue, classNames, style, ...props }: ProgressProps) {
    const value = isComplete ? 100 : Math.min(100, Math.max(0, current));
    return (<div {...props} data-abort={isAbort || undefined} data-complete={isComplete || undefined} data-paused={paused || undefined} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} style={{ ...style, ...valueStyle(value) }}>
      <div className={classNames?.track}>
        <div className={classNames?.fill} style={{ width: `${value}%` }}/>
      </div>
      {!hideValue && (<span aria-hidden className={classNames?.value}>
        {value}%
      </span>)}
    </div>);
}
