import React from "react";

function flattenChildren(node: React.ReactNode, out: React.ReactNode[] = []): React.ReactNode[] {
    React.Children.forEach(node, (child) => {
        if (React.isValidElement(child) && child.type === React.Fragment) {
            flattenChildren((child.props as { children?: React.ReactNode }).children, out);
        }
        else {
            out.push(child);
        }
    });
    return out;
}

function hasText(node: React.ReactNode): boolean {
    if (typeof node === "string")
        return node.trim().length > 0;
    if (typeof node === "number")
        return true;
    if (React.isValidElement(node))
        return hasText((node.props as { children?: React.ReactNode }).children);
    if (Array.isArray(node))
        return node.some((child) => hasText(child));
    return false;
}

export function isIconOnly(children: React.ReactNode): boolean {
    const arr = flattenChildren(children);
    return arr.length === 1 && React.isValidElement(arr[0]) && !hasText(arr[0]);
}

export function textChildren(children: React.ReactNode): React.ReactNode[] {
    return React.Children.toArray(flattenChildren(children).filter((child) => hasText(child)));
}
