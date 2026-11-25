"use client";
import * as React from "react";
import { resolveSlotClassName, type SlotClassName } from "../utils/cn";
export type ListControllerProps<T> = {
    items: T[];
    highlightIndex?: number | null;
    onHighlightChange?: (index: number | null) => void;
    onSelect?: (item: T, index: number) => void;
    onScrollBottom?: () => void;
    onItemMouseMove?: (item: T, index: number) => void;
    isItemDisabled?: (item: T, index: number) => boolean;
};
function useListController<T>(props: ListControllerProps<T>) {
    const { items, highlightIndex: controlledHighlight, onHighlightChange, onSelect, onScrollBottom, isItemDisabled } = props;
    const rootRef = React.useRef<HTMLUListElement | HTMLDivElement>(null);
    const [uncontrolledHighlight, setUncontrolledHighlight] = React.useState<number | null>(null);
    const isControlled = controlledHighlight !== undefined;
    const highlightIndex = isControlled ? controlledHighlight : uncontrolledHighlight;
    const setHighlightIndex = (next: number | null) => {
        if (!isControlled)
            setUncontrolledHighlight(next);
        onHighlightChange?.(next);
    };
    React.useLayoutEffect(() => {
        if (highlightIndex === null)
            return;
        const el = rootRef.current?.querySelector<HTMLElement>("[data-highlighted='true']");
        el?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }, [highlightIndex]);
    const moveHighlight = (delta: 1 | -1) => {
        if (items.length === 0)
            return;
        for (let step = 1; step <= items.length; step++) {
            const index = highlightIndex === null
                ? delta === 1 ? step - 1 : items.length - step
                : (highlightIndex + delta * step + items.length * 2) % items.length;
            if (!isItemDisabled?.(items[index], index)) {
                setHighlightIndex(index);
                return;
            }
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement | HTMLDivElement>) => {
        if (items.length === 0)
            return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            moveHighlight(1);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            moveHighlight(-1);
        }
        else if ((e.key === "Enter" || e.key === " ") && highlightIndex !== null) {
            e.preventDefault();
            if (!isItemDisabled?.(items[highlightIndex], highlightIndex))
                onSelect?.(items[highlightIndex], highlightIndex);
        }
    };
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        if (!onScrollBottom)
            return;
        const target = e.currentTarget;
        const threshold = 16;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
            onScrollBottom();
        }
    };
    return { rootRef, highlightIndex, setHighlightIndex, handleKeyDown, handleScroll };
}
export interface ListClassNames {
    viewport?: string;
    item?: SlotClassName;
    groupHeader?: string;
    root?: string;
    empty?: string;
    groups?: string;
}
export interface ListStyles {
    item?: React.CSSProperties;
    groupHeader?: React.CSSProperties;
    root?: React.CSSProperties;
    empty?: React.CSSProperties;
    groups?: React.CSSProperties;
}
export interface ListProps<T> {
    size?: "sm" | "md" | "lg" | "xl";
    id?: string;
    items: T[];
    getKey?: (item: T, index: number) => React.Key;
    getGroup?: (item: T, index: number) => string;
    renderGroupHeader?: (groupName: string) => React.ReactNode;
    renderItem: (item: T, index: number) => React.ReactNode;
    empty?: React.ReactNode;
    highlightIndex?: number | null;
    onHighlightChange?: (index: number | null) => void;
    onSelect?: (item: T, index: number) => void;
    onScrollBottom?: () => void;
    onItemMouseMove?: (item: T, index: number) => void;
    isItemDisabled?: (item: T, index: number) => boolean;
    className?: string;
    style?: React.CSSProperties;
    classNames?: ListClassNames;
    styles?: ListStyles;
}
export type OrderProps<T> = Omit<ListProps<T>, "getGroup" | "renderGroupHeader">;
const EMPTY_CLASS_NAMES: ListClassNames = {};
const EMPTY_STYLES: ListStyles = {};
function groupItems<T>(items: T[], getGroup: (item: T, index: number) => string) {
    const map = new Map<string, Array<{
        item: T;
        index: number;
    }>>();
    items.forEach((item, index) => {
        const name = getGroup(item, index);
        if (!map.has(name))
            map.set(name, []);
        map.get(name)!.push({ item, index });
    });
    return Array.from(map.entries());
}
function ListView<T>({ ordered = false, size = "lg", id, items, getKey, getGroup, renderGroupHeader, renderItem, empty, highlightIndex, onHighlightChange, onSelect, onScrollBottom, onItemMouseMove, isItemDisabled, className, style, classNames = EMPTY_CLASS_NAMES, styles = EMPTY_STYLES, }: ListProps<T> & {
    ordered?: boolean;
}) {
    const controller = useListController({
        items,
        highlightIndex,
        onHighlightChange,
        onSelect,
        onScrollBottom,
        isItemDisabled,
    });
    const hasGroup = !ordered && typeof getGroup === "function" && typeof renderGroupHeader === "function";
    const Tag = ordered ? "ol" : "ul";
    const generatedId = React.useId();
    const listBaseId = id ?? generatedId;
    const activeDescendant = controller.highlightIndex === null || isItemDisabled?.(items[controller.highlightIndex], controller.highlightIndex)
        ? undefined
        : `${listBaseId}-${controller.highlightIndex}`;
    const viewport = (content: React.ReactNode) => (<div ref={controller.rootRef as React.Ref<HTMLDivElement>} id={listBaseId} data-size={size} role="listbox" aria-activedescendant={activeDescendant} tabIndex={0} onKeyDown={controller.handleKeyDown} onScroll={controller.handleScroll} className={[classNames.viewport, className].filter(Boolean).join(" ") || undefined} style={style}>
      {content}
    </div>);
    const row = (item: T, index: number) => {
        const disabled = isItemDisabled?.(item, index) ?? false;
        return (<li id={`${listBaseId}-${index}`} key={getKey?.(item, index) ?? index} role="option" aria-selected={controller.highlightIndex === index} data-highlighted={controller.highlightIndex === index || undefined} data-disabled={disabled || undefined} aria-disabled={disabled || undefined} onClick={disabled ? undefined : () => onSelect?.(item, index)} onMouseMove={onItemMouseMove && !disabled ? () => onItemMouseMove(item, index) : undefined} className={resolveSlotClassName(classNames.item, { disabled })} style={styles.item}>
      {renderItem(item, index)}
    </li>);
    };
    if (items.length === 0 && empty !== undefined) {
        return viewport(<Tag data-ordered={ordered || undefined} role="presentation" className={classNames.root}>
        <li className={classNames.empty}>{empty}</li>
      </Tag>);
    }
    if (hasGroup) {
        return viewport(<div className={classNames.groups}>
        {groupItems(items, getGroup!).map(([groupName, groupItemsList]) => (<div key={groupName}>
            <div className={classNames.groupHeader} style={styles.groupHeader}>
              {renderGroupHeader!(groupName)}
            </div>
            <Tag role="presentation" className={classNames.root}>
              {groupItemsList.map(({ item, index }) => row(item, index))}
            </Tag>
          </div>))}
      </div>);
    }
    return viewport(<Tag data-ordered={ordered || undefined} role="presentation" className={classNames.root}>
      {items.map((item, index) => row(item, index))}
    </Tag>);
}
export function List<T>(props: ListProps<T>) {
    return <ListView {...props}/>;
}
export function Order<T>(props: OrderProps<T>) {
    return <ListView ordered {...props}/>;
}
