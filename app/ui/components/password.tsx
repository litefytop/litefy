"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { InputGroup } from "./input-group";

export interface PasswordGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  invalid?: boolean;
}

export function PasswordGroup({ className, invalid, ...props }: PasswordGroupProps) {
  return <InputGroup {...props} invalid={invalid} className={className} />;
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
        "appearance-none border-0 bg-transparent px-2 py-1 text-sm flex-1 outline-none",
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
        "hover:text-foreground/80 rounded-sm p-1 text-muted-foreground transition-colors",
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
  className?: ClassNameValue;
  classNames?: {
    root?: ClassNameValue;
    toggle?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
    toggle?: React.CSSProperties;
  };
}

export const Password = ({
  className,
  style,
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
    <PasswordGroup invalid={invalid} className={className} style={style}>
      <PasswordRoot
        {...props}
        disabled={disabled}
        visible={visible}
        aria-invalid={invalid || undefined}
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
