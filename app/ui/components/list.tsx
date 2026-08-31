"use client";

import type { Key, ReactNode } from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface ListRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ListRoot({ className, ...props }: ListRootProps) {
  return <div {...props} className={cn("overflow-y-auto", className)} />;
}

export interface ListItemProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ListItem({ className, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center gap-3 px-3 py-2 text-sm", className)}
    />
  );
}

export interface ListClassNames {
  root?: ClassNameValue;
  item?: ClassNameValue;
}

export interface ListStyles {
  root?: React.CSSProperties;
  item?: React.CSSProperties;
}

export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: (item: T, index: number) => Key;
  empty?: ReactNode;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: ListClassNames;
  styles?: ListStyles;
}

export function List<T>({
  items,
  renderItem,
  getKey,
  empty,
  className,
  style,
  classNames,
  styles,
}: ListProps<T>) {
  return (
    <ListRoot
      className={cn("divide-y divide-border", className, classNames?.root)}
      style={{ ...style, ...styles?.root }}
    >
      {items.length === 0 && empty !== undefined
        ? empty
        : items.map((item, index) => (
            <ListItem
              key={getKey?.(item, index) ?? index}
              className={classNames?.item}
              style={styles?.item}
            >
              {renderItem(item, index)}
            </ListItem>
          ))}
    </ListRoot>
  );
}
