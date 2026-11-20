"use client";
import * as React from "react";
import { ArrowLeft, ArrowRight } from "./icons";
import { Checkbox, type CheckboxClassNames } from "./checkbox";
export type TransferItemConfig = {
    label: React.ReactNode;
    value: string;
    disabled?: boolean;
};
export interface TransferProps extends Omit<React.ComponentProps<"div">, "className" | "onChange"> {
    dataSource: TransferItemConfig[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    titles?: [
        React.ReactNode,
        React.ReactNode
    ];
    moveRightLabel?: string;
    moveLeftLabel?: string;
    renderItem?: (item: TransferItemConfig) => React.ReactNode;
    className?: string;
    classNames?: {
        panel?: string;
        header?: string;
        count?: string;
        body?: string;
        empty?: string;
        item?: CheckboxClassNames;
        actions?: string;
        move?: string;
    };
    styles?: {
        panel?: React.CSSProperties;
        header?: React.CSSProperties;
        body?: React.CSSProperties;
        item?: React.CSSProperties;
        actions?: React.CSSProperties;
    };
}
export function Transfer({ dataSource, value: controlledValue, defaultValue, onChange, titles, moveRightLabel = "Move right", moveLeftLabel = "Move left", renderItem, className, classNames, styles, ...props }: TransferProps) {
    const [uncontrolledValue, setValue] = React.useState<string[]>(defaultValue ?? []);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const [sourceChecked, setSourceChecked] = React.useState<ReadonlySet<string>>(new Set());
    const [targetChecked, setTargetChecked] = React.useState<ReadonlySet<string>>(new Set());
    const valueSet = new Set(value);
    const sourceItems = dataSource.filter((item) => !valueSet.has(item.value));
    const targetItems = dataSource.filter((item) => valueSet.has(item.value));
    const toggle = (checked: ReadonlySet<string>, setChecked: (next: ReadonlySet<string>) => void, itemValue: string, nextChecked: boolean) => {
        const next = new Set(checked);
        if (nextChecked) {
            next.add(itemValue);
        }
        else {
            next.delete(itemValue);
        }
        setChecked(next);
    };
    const moveRight = () => {
        const next = dataSource
            .filter((item) => valueSet.has(item.value) || sourceChecked.has(item.value))
            .map((item) => item.value);
        if (!isControlled)
            setValue(next);
        onChange?.(next);
        setSourceChecked(new Set());
    };
    const moveLeft = () => {
        const next = value.filter((itemValue) => !targetChecked.has(itemValue));
        if (!isControlled)
            setValue(next);
        onChange?.(next);
        setTargetChecked(new Set());
    };
    const renderItemContent = (item: TransferItemConfig) => renderItem ? renderItem(item) : item.label;
    const renderItems = (items: TransferItemConfig[], checked: ReadonlySet<string>, setChecked: (next: ReadonlySet<string>) => void) => {
        if (items.length === 0) {
            return <p className={classNames?.empty}>No data</p>;
        }
        return items.map((item) => (<Checkbox key={item.value} checked={checked.has(item.value)} disabled={item.disabled} onCheckedChange={(next) => toggle(checked, setChecked, item.value, next)} classNames={classNames?.item} styles={{ label: styles?.item }}>
        {renderItemContent(item)}
      </Checkbox>));
    };
    const renderPanel = (items: TransferItemConfig[], checked: ReadonlySet<string>, setChecked: (next: ReadonlySet<string>) => void, title: React.ReactNode) => (<div className={classNames?.panel} style={styles?.panel}>
      <div className={classNames?.header} style={styles?.header}>
        {title}
        <span className={classNames?.count}>
          {checked.size}/{items.length}
        </span>
      </div>
      <div className={classNames?.body} style={styles?.body}>
        {renderItems(items, checked, setChecked)}
      </div>
    </div>);
    return (<div {...props} className={className}>
      {renderPanel(sourceItems, sourceChecked, setSourceChecked, titles?.[0])}
      <div className={classNames?.actions} style={styles?.actions}>
        <button type="button" aria-label={moveRightLabel} disabled={sourceChecked.size === 0} onClick={moveRight} className={classNames?.move}>
          <ArrowRight aria-hidden/>
        </button>
        <button type="button" aria-label={moveLeftLabel} disabled={targetChecked.size === 0} onClick={moveLeft} className={classNames?.move}>
          <ArrowLeft aria-hidden/>
        </button>
      </div>
      {renderPanel(targetItems, targetChecked, setTargetChecked, titles?.[1])}
    </div>);
}
