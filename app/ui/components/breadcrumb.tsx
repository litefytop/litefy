"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface BreadcrumbRootProps extends Omit<React.ComponentProps<"nav">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbRoot({ className, ...props }: BreadcrumbRootProps) {
  return <nav aria-label="breadcrumb" {...props} className={cn("flex", className)} />;
}

export interface BreadcrumbListProps extends Omit<React.ComponentProps<"ol">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return <ol {...props} className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)} />;
}

export interface BreadcrumbItemProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li {...props} className={cn("flex items-center", className)} />;
}

export interface BreadcrumbLinkProps extends Omit<React.ComponentProps<"a">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      {...props}
      className={cn(
        "rounded-sm text-foreground transition-colors hover:text-foreground/80 focus-visible:underline p-1 cursor-pointer",
        className,
      )}
    />
  );
}

export interface BreadcrumbPageProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      role="link"
      {...props}
      className={cn("font-medium text-foreground", className)}
    />
  );
}

export interface BreadcrumbSeparatorProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}
export function BreadcrumbSeparator({ className, children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      aria-hidden
      role="presentation"
      {...props}
      className={cn("flex items-center text-muted-foreground", className)}
    >
      {children ?? <ChevronRight className="size-3.5" />}
    </li>
  );
}

export interface BreadcrumbDataItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends Omit<BreadcrumbRootProps, "className"> {
  items: BreadcrumbDataItem[];
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    list?: ClassNameValue;
    link?: ClassNameValue;
    page?: ClassNameValue;
    separator?: ClassNameValue;
  };
  styles?: {
    list?: React.CSSProperties;
    link?: React.CSSProperties;
    page?: React.CSSProperties;
    separator?: React.CSSProperties;
  };
}

export function Breadcrumb({
  items,
  className,
  style,
  classNames,
  styles,
  ...props
}: BreadcrumbProps) {
  return (
    <BreadcrumbRoot {...props} className={cn(className)} style={style}>
      <BreadcrumbList className={classNames?.list} style={styles?.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={classNames?.page} style={styles?.page}>
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className={classNames?.link}
                    style={styles?.link}
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={classNames?.separator} style={styles?.separator} />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
