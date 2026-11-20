"use client";
import * as React from "react";
import { ChevronRight } from "./icons";
export interface BreadcrumbRootProps extends Omit<React.ComponentProps<"nav">, "className"> {
    className?: string;
}
export function BreadcrumbRoot(props: BreadcrumbRootProps) {
    return <nav aria-label="breadcrumb" {...props}/>;
}
export interface BreadcrumbListProps extends Omit<React.ComponentProps<"ol">, "className"> {
    className?: string;
}
export function BreadcrumbList(props: BreadcrumbListProps) {
    return <ol {...props}/>;
}
export interface BreadcrumbItemProps extends Omit<React.ComponentProps<"li">, "className"> {
    className?: string;
}
export function BreadcrumbItem(props: BreadcrumbItemProps) {
    return <li {...props}/>;
}
export interface BreadcrumbLinkProps extends Omit<React.ComponentProps<"a">, "className"> {
    className?: string;
}
export function BreadcrumbLink(props: BreadcrumbLinkProps) {
    return (<a {...props}/>);
}
export interface BreadcrumbPageProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
}
export function BreadcrumbPage(props: BreadcrumbPageProps) {
    return (<span aria-current="page" aria-disabled="true" role="link" {...props}/>);
}
export interface BreadcrumbSeparatorProps extends Omit<React.ComponentProps<"li">, "className"> {
    className?: string;
    classNames?: {
        icon?: string;
    };
}
export function BreadcrumbSeparator({ className, classNames, children, ...props }: BreadcrumbSeparatorProps) {
    return (<li aria-hidden role="presentation" {...props} className={className}>
      {children ?? <ChevronRight aria-hidden className={classNames?.icon}/>}
    </li>);
}
export interface BreadcrumbDataItem {
    label: React.ReactNode;
    href?: string;
}
export interface BreadcrumbProps extends Omit<BreadcrumbRootProps, "className"> {
    items: BreadcrumbDataItem[];
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        list?: string;
        item?: string;
        link?: string;
        page?: string;
        separator?: string;
        separatorIcon?: string;
    };
    styles?: {
        list?: React.CSSProperties;
        item?: React.CSSProperties;
        link?: React.CSSProperties;
        page?: React.CSSProperties;
        separator?: React.CSSProperties;
    };
}
export function Breadcrumb({ items, className, style, classNames, styles, ...props }: BreadcrumbProps) {
    return (<BreadcrumbRoot {...props} className={className} style={style}>
      <BreadcrumbList className={classNames?.list} style={styles?.list}>
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<React.Fragment key={`${item.href ?? ""}:${String(item.label)}`}>
              <BreadcrumbItem className={classNames?.item} style={styles?.item}>
                {isLast ? (<BreadcrumbPage className={classNames?.page} style={styles?.page}>
                    {item.label}
                  </BreadcrumbPage>) : (<BreadcrumbLink href={item.href} className={classNames?.link} style={styles?.link}>
                    {item.label}
                  </BreadcrumbLink>)}
              </BreadcrumbItem>
              {!isLast && (<BreadcrumbSeparator className={classNames?.separator} style={styles?.separator} classNames={{ icon: classNames?.separatorIcon }}/>)}
            </React.Fragment>);
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>);
}
