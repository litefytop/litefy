"use client";
import * as React from "react";
import { ArrowLeft, ArrowRight } from "./icons";
import { Button } from "./button";
import { Checkbox, type CheckboxClassNames } from "./checkbox";
import { resolveSlotClassName, type SlotClassName, type SlotState } from "../utils/cn";
export type TransferItemConfig = {
    label: React.ReactNode;
    value: string;
    disabled?: boolean;
};
export interface TransferProps extends Omit<React.ComponentProps<"div">, "className" | "onChange"> {
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
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
    showMoveLabels?: boolean;
    renderItem?: (item: TransferItemConfig) => React.ReactNode;
    className?: string;
    classNames?: {
        panel?: string;
        header?: string;
        count?: string;
        body?: string;
        empty?: string;
        item?: CheckboxClassNames | ((state: SlotState) => CheckboxClassNames);
        actions?: string;
        move?: SlotClassName;
    };
    styles?: {
        panel?: React.CSSProperties;
        header?: React.CSSProperties;
        body?: React.CSSProperties;
        item?: React.CSSProperties;
        actions?: React.CSSProperties;
    };
}
export function Transfer({ size = "2xl", dataSource, value: controlledValue, defaultValue, onChange, titles, moveRightLabel = "Move right", moveLeftLabel = "Move left", showMoveLabels = false, renderItem, className, classNames, styles, ...props }: TransferProps) {
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
        return items.map((item) => (<Checkbox key={item.value} checked={checked.has(item.value)} disabled={item.disabled} onCheckedChange={(next) => toggle(checked, setChecked, item.value, next)} classNames={typeof classNames?.item === "function" ? classNames.item({ disabled: Boolean(item.disabled) }) : classNames?.item} styles={{ label: styles?.item }}>
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
    const moveRightDisabled = sourceChecked.size === 0;
    const moveLeftDisabled = targetChecked.size === 0;
    return (<div {...props} data-size={size} className={className}>
      {renderPanel(sourceItems, sourceChecked, setSourceChecked, titles?.[0])}
      <div className={classNames?.actions} style={styles?.actions}>
        <Button type="button" aria-label={moveRightLabel} disabled={moveRightDisabled} onClick={moveRight} className={resolveSlotClassName(classNames?.move, { disabled: moveRightDisabled })} icon={<ArrowRight aria-hidden/>}>{showMoveLabels ? moveRightLabel : null}</Button>
        <Button type="button" aria-label={moveLeftLabel} disabled={moveLeftDisabled} onClick={moveLeft} className={resolveSlotClassName(classNames?.move, { disabled: moveLeftDisabled })} icon={<ArrowLeft aria-hidden/>}>{showMoveLabels ? moveLeftLabel : null}</Button>
      </div>
      {renderPanel(targetItems, targetChecked, setTargetChecked, titles?.[1])}
    </div>);
}
