"use client";
import * as React from "react";
import { ChevronRight } from "./icons";
import { List, type ListClassNames } from "./list";
import { PopoverContent } from "./popover";
export interface CascaderClassNames {
    root?: string;
    breadcrumb?: string;
    trigger?: string;
    chevron?: string;
    menu?: string;
    option?: string;
    list?: ListClassNames;
}
export type CascaderNode = {
    value: string;
    label: string;
    children?: CascaderNode[];
};
export interface CascaderTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
}
export function CascaderTrigger(props: CascaderTriggerProps) {
    return (<button {...props}/>);
}
export interface CascaderProps extends Omit<React.ComponentProps<"div">, "children" | "className"> {
    tree: CascaderNode[];
    disabled?: boolean;
    placeholder?: string;
    width?: string | number;
    className?: string;
    classNames?: CascaderClassNames;
    chevronNode?: React.ReactNode;
    styles?: {
        root?: React.CSSProperties;
        trigger?: React.CSSProperties;
        menu?: React.CSSProperties;
    };
}
export function Cascader({ tree, disabled, placeholder = "Select your location", width = "24rem", className, classNames, chevronNode, styles, style, ...props }: CascaderProps) {
    const uid = React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
    const [openLevel, setOpenLevel] = React.useState<number | null>(null);
    const [path, setPath] = React.useState<CascaderNode[]>([]);
    const [selected, setSelected] = React.useState<CascaderNode | null>(null);
    const levels = React.useMemo(() => [{ items: tree, id: "root" }, ...path.map((node) => ({ items: node.children ?? [], id: node.value }))], [path, tree]);
    const handleTriggerClick = (index: number) => {
        if (disabled)
            return;
        setPath((prev) => prev.slice(0, index));
        setSelected(null);
        setOpenLevel((prev) => (prev === index ? null : index));
    };
    const handleSelect = (node: CascaderNode) => {
        if (node.children) {
            setPath((prev) => [...prev.slice(0, path.length), node]);
            setOpenLevel(path.length + 1);
        }
        else {
            setSelected(node);
            setOpenLevel(null);
        }
    };
    const cols = Math.max(1, path.length + (selected ? 1 : 0));
    const trigger = (<div className={classNames?.breadcrumb} data-placeholder-shown={path.length === 0 || undefined} style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cols}, minmax(64px, 1fr))`, alignItems: "center" }}>
      {path.length === 0 ? (<CascaderTrigger disabled={disabled} aria-expanded={openLevel === 0} onClick={() => handleTriggerClick(0)} style={styles?.trigger} className={classNames?.trigger}>
          {placeholder}
        </CascaderTrigger>) : (<>
          {path.map((node, i) => (<span key={node.value} className="flex min-w-0 items-center overflow-hidden">
              {i > 0 && (chevronNode ?? <ChevronRight className={classNames?.chevron} aria-hidden/>)}
              <CascaderTrigger disabled={disabled} aria-expanded={openLevel === i} onClick={() => handleTriggerClick(i)} style={styles?.trigger} className={classNames?.trigger}>
                {node.label}
              </CascaderTrigger>
            </span>))}
          {selected && (<span className="flex min-w-0 items-center overflow-hidden">
              {chevronNode ?? <ChevronRight className={classNames?.chevron} aria-hidden/>}
              <CascaderTrigger disabled={disabled} aria-expanded={openLevel === path.length} aria-current="step" onClick={() => handleTriggerClick(path.length)} style={styles?.trigger} className={classNames?.trigger}>
                {selected.label}
              </CascaderTrigger>
            </span>)}
        </>)}
    </div>);
    const panels = levels.map(({ items, id }, level) => {
        const isOpen = openLevel === level;
        return (<PopoverContent key={id} open={isOpen} onOpenChange={(v) => {
                if (!v)
                    setOpenLevel(null);
            }} anchorName={`--cascader-${uid}-root`} placement={{ matchWidth: true }} className={classNames?.menu} style={styles?.menu}>
        <List items={items} classNames={classNames?.list} renderItem={(node) => (<span className={classNames?.option}>
              <span>{node.label}</span>
              {node.children && (chevronNode ?? <ChevronRight className={classNames?.chevron} aria-hidden/>)}
            </span>)} getKey={(node) => node.value} onSelect={handleSelect} />
      </PopoverContent>);
    });
    return (<>
      <div {...props} inert={disabled || undefined} data-anchor-name={`--cascader-${uid}-root`} style={{ maxWidth: `min(100%, ${typeof width === "number" ? `${width}px` : width})`, ...styles?.root, ...style }} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined}>
        {trigger}
      </div>
      {panels}
    </>);
}
