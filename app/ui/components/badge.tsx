"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Tag } from "./tag";

export interface BadgeProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  label?: React.ReactNode;
  classNames?: {
    label?: ClassNameValue;
  };
  styles?: {
    label?: React.CSSProperties;
  };
}

export function Badge({ children, className, label, classNames, styles, ...props }: BadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative flex items-center justify-center size-12 rounded-md shadow-md",
        className,
      )}
    >
      <Tag
        children={label}
        className={[
          "absolute top-0 right-0 rounded-full translate-x-[50%] translate-y-[-50%]",
          classNames?.label,
        ]}
        style={styles?.label}
      />
      {children}
    </div>
  );
}
