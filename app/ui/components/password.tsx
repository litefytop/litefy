"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { type ClassNameValue, cn } from "..";

export interface PasswordGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  invalid?: boolean;
}

export function PasswordGroup({ className, invalid, ...props }: PasswordGroupProps) {
  return (
    <div
      {...props}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "flex w-full max-w-sm min-w-3xs items-center rounded-md border border-border shadow-xs transition-colors px-2 h-9",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
        className,
      )}
    />
  );
}

export interface PasswordRootProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> {
  className?: ClassNameValue;
  visible?: boolean;
}

export function PasswordRoot({ className, visible, ...props }: PasswordRootProps) {
  return (
    <input
      {...props}
      type={visible ? "text" : "password"}
      className={cn(
        "appearance-none border-0 bg-transparent px-2 py-1 text-sm flex-1 min-w-0 outline-none",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground ring-0",
        className,
      )}
    />
  );
}

export interface PasswordToggleProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
  visible?: boolean;
}

export function PasswordToggle({ className, visible, children, ...props }: PasswordToggleProps) {
  return (
    <button
      {...props}
      type="button"
      aria-pressed={visible}
      aria-label={visible ? "Hide password" : "Show password"}
      className={cn(
        "hover:text-foreground/80 rounded-md p-1 text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children ?? (visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />)}
    </button>
  );
}

export interface PasswordProps extends Omit<PasswordRootProps, "className" | "visible"> {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  invalid?: boolean;
  classNames?: {
    group?: ClassNameValue;
    root?: ClassNameValue;
    toggle?: ClassNameValue;
  };
  styles?: {
    group?: React.CSSProperties;
    root?: React.CSSProperties;
    toggle?: React.CSSProperties;
  };
}

export const Password = ({
  visible: controlledVisible,
  defaultVisible = false,
  onVisibleChange,
  invalid,
  disabled,
  classNames,
  styles,
  ...props
}: PasswordProps) => {
  const [uncontrolledVisible, setVisible] = React.useState(defaultVisible);
  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : uncontrolledVisible;

  const handleToggle = () => {
    const next = !visible;
    if (!isControlled) setVisible(next);
    onVisibleChange?.(next);
  };

  return (
    <PasswordGroup invalid={invalid} className={classNames?.group} style={styles?.group}>
      <PasswordRoot
        {...props}
        disabled={disabled}
        visible={visible}
        className={classNames?.root}
        style={styles?.root}
      />
      <PasswordToggle
        visible={visible}
        disabled={disabled}
        onClick={handleToggle}
        className={classNames?.toggle}
        style={styles?.toggle}
      />
    </PasswordGroup>
  );
};
