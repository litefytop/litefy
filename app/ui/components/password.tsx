"use client";
import * as React from "react";
import { Eye, EyeOff } from "./icons";
import { Field, type FieldClassNames, type FieldValidateResult } from "./field";
export interface PasswordGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
    invalid?: boolean;
}
export function PasswordGroup({ className, invalid, ...props }: PasswordGroupProps) {
    return <div {...props} data-invalid={invalid || undefined} className={className}/>;
}
export interface PasswordRootProps extends Omit<React.ComponentProps<"input">, "type" | "className"> {
    className?: string;
    visible?: boolean;
}
export function PasswordRoot({ className, visible, ...props }: PasswordRootProps) {
    const autoId = React.useId();
    const id = props.id ?? autoId;
    return (<input {...props} id={id} type={visible ? "text" : "password"} className={className}/>);
}
export interface PasswordToggleProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
    visible?: boolean;
    classNames?: {
        icon?: string;
    };
}
export function PasswordToggle({ className, visible, children, classNames, ...props }: PasswordToggleProps) {
    return (<button data-field-trailing="" {...props} type="button" tabIndex={-1} aria-pressed={visible} aria-label={visible ? "Hide password" : "Show password"} className={className}>
      {children ?? (visible ? <EyeOff className={classNames?.icon}/> : <Eye className={classNames?.icon}/>)}
    </button>);
}
export interface PasswordProps extends Omit<PasswordRootProps, "className" | "visible"> {
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    invalid?: boolean;
    label?: React.ReactNode;
    description?: React.ReactNode;
    validate?: (value: string) => FieldValidateResult | Promise<FieldValidateResult>;
    validateTrigger?: "submit" | "change" | "blur";
    fieldClassNames?: FieldClassNames;
    className?: string;
    classNames?: {
        root?: string;
        toggle?: string;
        toggleIcon?: string;
        hint?: string;
    };
    styles?: {
        root?: React.CSSProperties;
        toggle?: React.CSSProperties;
        hint?: React.CSSProperties;
    };
}
export const Password = ({ className, style, visible: controlledVisible, defaultVisible = false, onVisibleChange, invalid, disabled, label, description, validate, validateTrigger, fieldClassNames, classNames, styles, ...props }: PasswordProps) => {
    const [uncontrolledVisible, setVisible] = React.useState(defaultVisible);
    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : uncontrolledVisible;
    const handleToggle = () => {
        const next = !visible;
        if (!isControlled)
            setVisible(next);
        onVisibleChange?.(next);
    };
    const shiftOnlyRef = React.useRef(false);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);
        if (e.defaultPrevented)
            return;
        if (e.key === "Shift")
            shiftOnlyRef.current = true;
        else
            shiftOnlyRef.current = false;
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyUp?.(e);
        if (e.defaultPrevented)
            return;
        if (e.key === "Shift" && shiftOnlyRef.current) {
            shiftOnlyRef.current = false;
            if (!disabled)
                handleToggle();
        }
    };
    const hintId = React.useId();
    const composeGroup = (field?: { id: string; name: string; describedBy: string | undefined; invalid: boolean }) => {
        const describedBy = [field?.describedBy, hintId, props["aria-describedby"]].filter(Boolean).join(" ") || undefined;
        return (<PasswordGroup invalid={invalid || field?.invalid} className={className} style={style}>
          <PasswordRoot {...props} disabled={disabled} visible={visible} id={field?.id ?? props.id} name={field?.name ?? props.name} autoComplete={props.autoComplete ?? "current-password"} aria-invalid={invalid || field?.invalid || undefined} aria-describedby={describedBy} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className={classNames?.root} style={styles?.root}/>
          <PasswordToggle visible={visible} disabled={disabled} onClick={handleToggle} className={classNames?.toggle} style={styles?.toggle} classNames={{ icon: classNames?.toggleIcon }}/>
          <span id={hintId} className={classNames?.hint} style={styles?.hint}>
            ⇧ Shift
          </span>
        </PasswordGroup>);
    };
    if (label === undefined && description === undefined && validate === undefined) {
        return composeGroup();
    }
    return (<Field
      name={props.name ?? ""}
      label={label}
      description={description}
      required={props.required}
      validate={validate}
      validateTrigger={validateTrigger}
      fieldClassNames={fieldClassNames}
    >
      {(f) => composeGroup({ id: f.id, name: f.name, describedBy: f.describedBy, invalid: f.invalid })}
    </Field>);
};
