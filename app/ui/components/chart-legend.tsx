"use client";
import * as React from "react";
export interface ChartLegendClassNames {
    root?: string;
    item?: string;
    swatch?: string;
}
export interface ChartLegendProps {
    items: {
        label: string;
        color: string;
    }[];
    hidden?: ReadonlySet<number>;
    swatch?: "line" | "square";
    onToggle?: (index: number) => void;
    onHover?: (index: number | null) => void;
    className?: string;
    style?: React.CSSProperties;
    classNames?: ChartLegendClassNames;
}
export function ChartLegend({ items, hidden, swatch = "line", onToggle, onHover, className, style, classNames, }: ChartLegendProps) {
    return (<div className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} style={style}>
      {items.map((item, i) => (<button key={item.label} type="button" className={classNames?.item} onMouseEnter={() => onHover?.(i)} onMouseLeave={() => onHover?.(null)} onClick={() => onToggle?.(i)} data-hidden={hidden?.has(i) || undefined}>
          <span className={classNames?.swatch} data-shape={swatch} style={{ background: item.color }}/>
          {item.label}
        </button>))}
    </div>);
}
