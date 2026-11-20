"use client";
import { ChevronRight } from "./icons";
import * as React from "react";

export interface TreeItemConfig {
    label: React.ReactNode;
    value?: string;
    href?: string;
    icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
    disabled?: boolean;
    defaultOpen?: boolean;
    children?: TreeItemConfig[];
}
export interface TreeSeparatorConfig {
    type: "separator";
    label: React.ReactNode;
}
export type TreeNodeConfig = TreeItemConfig | TreeSeparatorConfig;
export function isTreeSeparator(node: TreeNodeConfig): node is TreeSeparatorConfig {
    return (node as TreeSeparatorConfig).type === "separator";
}
export interface TreeRootProps extends Omit<React.ComponentProps<"ul">, "className" | "onKeyDown"> {
    className?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLUListElement>;
}
export function TreeRoot(props: TreeRootProps) {
    return (<ul {...props} role="tree"/>);
}
export interface TreeTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
    open?: boolean;
}
export function TreeTrigger({ className, open, ...props }: TreeTriggerProps) {
    return (<button {...props} type="button" role="treeitem" aria-expanded={open} data-open={open} className={className}/>);
}
export interface TreeItemProps extends Omit<React.ComponentProps<"a">, "className" | "href"> {
    className?: string;
    href?: string;
}
export function TreeItem({ className, href, ...props }: TreeItemProps) {
    return (<a {...props} role="treeitem" href={href} className={className}/>);
}
export interface TreeLabelProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function TreeLabel(props: TreeLabelProps) {
    return (<div {...props}/>);
}
const depthStyle = (depth: number): React.CSSProperties => ({
    ["--litefy-depth" as string]: depth,
});
function visibleRows(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter((el) => !el.closest('section[data-open="false"]'));
}
function nodeValue(node: TreeItemConfig, parentKey: string, index: number): string {
    return node.value ?? `${parentKey}#${index}`;
}
function collectFolderKeysUnder(nodes: TreeNodeConfig[], parentKey: string): string[] {
    const out: string[] = [];
    nodes.forEach((node, i) => {
        if (isTreeSeparator(node))
            return;
        const value = nodeValue(node, parentKey, i);
        if (node.children?.length) {
            out.push(value, ...collectFolderKeysUnder(node.children, value));
        }
    });
    return out;
}
function descendantFolderKeys(items: TreeNodeConfig[], target: string): string[] {
    const find = (nodes: TreeNodeConfig[], parentKey: string): string[] | null => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (isTreeSeparator(node))
                continue;
            const value = nodeValue(node, parentKey, i);
            if (node.children?.length) {
                if (value === target)
                    return collectFolderKeysUnder(node.children, value);
                const deep = find(node.children, value);
                if (deep)
                    return deep;
            }
        }
        return null;
    };
    return find(items, "") ?? [];
}
function collectDefaultOpenKeys(nodes: TreeNodeConfig[], parentKey: string, into: string[]): void {
    nodes.forEach((node, i) => {
        if (isTreeSeparator(node))
            return;
        const value = nodeValue(node, parentKey, i);
        if (node.children?.length) {
            if (node.defaultOpen)
                into.push(value);
            collectDefaultOpenKeys(node.children, value, into);
        }
    });
}
export interface TreeProps extends Omit<TreeRootProps, "className" | "children"> {
    items: TreeNodeConfig[];
    value?: string | null;
    onValueChange?: (value: string) => void;
    navigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
    openKeys?: string[];
    defaultOpenKeys?: string[];
    onOpenChange?: (keys: string[]) => void;
    className?: string;
    classNames?: {
        trigger?: string;
        item?: string;
        label?: string;
        group?: string;
        node?: string;
        labelText?: string;
        icon?: string;
        branch?: string;
        clip?: string;
    };
    styles?: {
        trigger?: React.CSSProperties;
        item?: React.CSSProperties;
        label?: React.CSSProperties;
    };
}
export function Tree({ items, value, onValueChange, navigate, openKeys, defaultOpenKeys, onOpenChange, className, classNames, styles, ...props }: TreeProps) {
    const rootRef = React.useRef<HTMLUListElement>(null);
    const [innerOpenKeys, setInnerOpenKeys] = React.useState<string[]>(() => {
        if (defaultOpenKeys)
            return defaultOpenKeys;
        const initial: string[] = [];
        collectDefaultOpenKeys(items, "", initial);
        return initial;
    });
    const openKeys$ = openKeys ?? innerOpenKeys;
    const isOpen = (key: string) => openKeys$.includes(key);
    const toggleOpen = (key: string) => {
        const next = isOpen(key)
            ? openKeys$.filter((k) => k !== key && !descendantFolderKeys(items, key).includes(k))
            : [...openKeys$, key];
        if (openKeys === undefined)
            setInnerOpenKeys(next);
        onOpenChange?.(next);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        const root = rootRef.current;
        const target = event.target as HTMLElement;
        if (!root || target === root)
            return;
        const isTrigger = target.hasAttribute("aria-expanded");
        const isItem = target.getAttribute("role") === "treeitem" && !isTrigger;
        if (!isTrigger && !isItem)
            return;
        const rows = visibleRows(root);
        const index = rows.indexOf(target);
        const move = (row: HTMLElement | null | undefined) => {
            if (row) {
                event.preventDefault();
                row.focus();
            }
        };
        const parentTrigger = () => target.closest("li")?.parentElement?.closest("li")?.querySelector<HTMLElement>('[role="treeitem"][aria-expanded]');
        const firstChildRow = () => target.closest("li")?.querySelector<HTMLElement>('section [role="treeitem"]');
        const targetValue = target.dataset.value;
        switch (event.key) {
            case "ArrowDown":
                move(rows[index + 1]);
                break;
            case "ArrowUp":
                move(rows[index - 1]);
                break;
            case "Home":
                move(rows[0]);
                break;
            case "End":
                move(rows.at(-1));
                break;
            case "ArrowRight":
                if (isTrigger && targetValue) {
                    if (!isOpen(targetValue)) {
                        event.preventDefault();
                        toggleOpen(targetValue);
                    }
                    else {
                        move(firstChildRow());
                    }
                }
                break;
            case "ArrowLeft":
                if (isTrigger && targetValue && isOpen(targetValue)) {
                    event.preventDefault();
                    toggleOpen(targetValue);
                }
                else {
                    move(parentTrigger());
                }
                break;
        }
    };
    const renderNodes = (nodes: TreeNodeConfig[], depth: number, parentKey: string): React.ReactNode => nodes.map((node, i) => {
        if (isTreeSeparator(node)) {
            return (<li role="none" key={String(node.label)}>
          <div className={classNames?.label} style={{ ...depthStyle(depth), ...styles?.label }}>
            {node.label}
          </div>
        </li>);
        }
        const value0 = nodeValue(node, parentKey, i);
        if (node.children?.length) {
            const nodeKey = value0;
            const open = isOpen(nodeKey);
            const iconNode = typeof node.icon === "function" ? node.icon(open) : node.icon;
            return (<li role="none" key={nodeKey} className={classNames?.node}>
          <TreeTrigger open={open} aria-level={depth + 1} data-value={nodeKey} disabled={node.disabled} onClick={() => toggleOpen(nodeKey)} style={{ ...depthStyle(depth), ...styles?.trigger }} className={classNames?.trigger}>
            {iconNode ? <span className={classNames?.icon} aria-hidden>{iconNode}</span> : null}
            <span className={classNames?.labelText}>{node.label}</span>
            <ChevronRight className={classNames?.icon} data-open={open} aria-hidden/>
          </TreeTrigger>
          <section data-open={open} className={classNames?.branch} style={{
                    ...depthStyle(depth),
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                }}>
            <div className={classNames?.clip} style={{ overflow: "hidden", minHeight: 0 }}>
              <ul role="group" className={classNames?.group}>
                {renderNodes(node.children, depth + 1, nodeKey)}
              </ul>
            </div>
          </section>
        </li>);
        }
        const itemValue = value0;
        const href = node.href;
        const active = value !== undefined && value !== null && value === itemValue;
        const leafIcon = typeof node.icon === "function" ? node.icon(false) : node.icon;
        const rowProps = {
            "aria-level": depth + 1,
            "data-value": itemValue,
            "data-active": active,
            "aria-disabled": node.disabled || undefined,
            style: { ...depthStyle(depth), ...styles?.item },
            className: classNames?.item,
        };
        return (<li role="none" key={itemValue}>
        {href !== undefined ? (<TreeItem href={href} aria-current={active ? "page" : undefined} {...rowProps} onClick={navigate
                ? (event) => {
                    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                        event.preventDefault();
                        navigate(href, event);
                    }
                }
                : undefined}>
            {leafIcon ? <span className={classNames?.icon} aria-hidden>{leafIcon}</span> : null}
            <span className={classNames?.labelText}>{node.label}</span>
          </TreeItem>) : (<button type="button" role="treeitem" disabled={node.disabled} onClick={() => onValueChange?.(itemValue)} {...rowProps}>
            {leafIcon ? <span className={classNames?.icon} aria-hidden>{leafIcon}</span> : null}
            <span className={classNames?.labelText}>{node.label}</span>
          </button>)}
      </li>);
    });
    return (<TreeRoot {...props} ref={rootRef} className={className} onKeyDown={handleKeyDown}>
      {renderNodes(items, 0, "")}
    </TreeRoot>);
}
