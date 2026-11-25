import * as React from "react";
import { Check, Minus } from "./icons";
import { FormContext } from "./form";
export interface CheckboxRootProps extends Omit<React.ComponentProps<"input">, "type" | "className" | "value"> {
    className?: string;
    value?: string;
    indeterminate?: boolean;
}
export function CheckboxRoot({ className, onKeyDown, indeterminate = false, ref: consumerRef, ...props }: CheckboxRootProps) {
    const autoId = React.useId();
    const id = props.id ?? autoId;
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return (<input {...props} ref={(el) => {
            inputRef.current = el;
            if (typeof consumerRef === "function") consumerRef(el);
            else if (consumerRef) consumerRef.current = el;
        }} id={id} type="checkbox" className={className} onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.click();
            }
            onKeyDown?.(e);
        }}/>);
}
export interface CheckboxIndicatorProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
}
export function CheckboxIndicator({ className, children, ...props }: CheckboxIndicatorProps) {
    return (<span {...props} className={className}>
      {children}
    </span>);
}
export interface CheckboxLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
    className?: string;
}
export function CheckboxLabel({ className, children, ...props }: CheckboxLabelProps) {
    return (<label {...props} className={className}>
      {children}
    </label>);
}
export interface CheckboxProps extends Omit<CheckboxRootProps, "className" | "style" | "styles"> {
    className?: string;
    style?: React.CSSProperties;
    onCheckedChange?: (checked: boolean) => void;
    lineThrough?: boolean;
    indicator?: React.ReactNode;
    classNames?: CheckboxClassNames;
    styles?: {
        indicator?: React.CSSProperties;
        label?: React.CSSProperties;
    };
}
export interface CheckboxClassNames {
    input?: string;
    indicator?: string;
    label?: string;
    icon?: string;
    text?: string;
}
export const Checkbox = ({ className, style, children, checked, defaultChecked, onChange, onCheckedChange, disabled, indeterminate = false, lineThrough = false, classNames, styles, indicator, ...props }: CheckboxProps) => {
    const [_checked, setChecked] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const checked$ = isControlled ? checked : _checked;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        const next = e.target.checked;
        if (!isControlled) {
            setChecked(next);
        }
        onCheckedChange?.(next);
    };
    return (<CheckboxLabel className={[classNames?.label, className].filter(Boolean).join(" ")} style={style}>
      <CheckboxIndicator data-selected={checked$ || indeterminate || undefined} className={classNames?.indicator} style={styles?.indicator}>
        <CheckboxRoot {...props} indeterminate={indeterminate} disabled={disabled} checked={checked$} onChange={handleChange} className={classNames?.input}/>
        {indicator ?? (indeterminate ? <Minus className={classNames?.icon}/> : checked$ ? <Check className={classNames?.icon}/> : null)}
      </CheckboxIndicator>
      {lineThrough ? <span data-line="" className={classNames?.text}>{children}</span> : children}
    </CheckboxLabel>);
};
export interface CheckboxOptionConfig extends Omit<CheckboxProps, "children"> {
    label: string;
    value: string;
}
export interface CheckboxOptionGroup {
    group: string;
    options: CheckboxOptionConfig[];
}
export interface CheckboxGroupClassNames {
    root?: string;
    groupLabel?: string;
    section?: string;
    label?: string;
}
export interface CheckboxGroupProps {
    options: (CheckboxOptionConfig | CheckboxOptionGroup)[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    name?: string;
    disabled?: boolean;
    label?: React.ReactNode;
    className?: string;
    classNames?: CheckboxGroupClassNames;
    "aria-label"?: string;
    common?: {
        lineThrough?: boolean;
        classNames?: CheckboxClassNames;
        styles?: {
            indicator?: React.CSSProperties;
            label?: React.CSSProperties;
        };
        indicator?: React.ReactNode;
    };
}
const EMPTY_VALUES: string[] = [];
export function CheckboxGroup({ options, value, defaultValue = EMPTY_VALUES, onChange, name, disabled, label, className, classNames, common, "aria-label": ariaLabel, }: CheckboxGroupProps) {
    const [_value, setValue] = React.useState<string[]>(defaultValue);
    const isControlled = value !== undefined;
    const value$ = isControlled ? value : _value;
    const selectedSet = React.useMemo(() => new Set(value$), [value$]);
    const { register: registerField, unregister: unregisterField, setFormValues, } = React.useContext(FormContext);
    React.useEffect(() => {
        if (!name)
            return;
        registerField(name, null, (v) => {
            const next = v === null ? [] : Array.isArray(v) ? v.map(String) : [String(v)];
            if (!isControlled)
                setValue(next);
            onChange?.(next);
        });
        return () => unregisterField(name);
    }, [name, isControlled, onChange, registerField, unregisterField]);
    const handleToggle = (val: string) => {
        const next = selectedSet.has(val) ? value$.filter((v) => v !== val) : [...value$, val];
        if (!isControlled) {
            setValue(next);
        }
        onChange?.(next);
        if (name)
            setFormValues((prev) => ({ ...prev, [name]: next }));
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowDown" &&
            e.key !== "ArrowUp" &&
            e.key !== "ArrowRight" &&
            e.key !== "ArrowLeft") {
            return;
        }
        const target = e.target as HTMLInputElement;
        if (!target)
            return;
        if (target.tagName !== "INPUT")
            return;
        const inputs = Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not(:disabled)'));
        const index = inputs.indexOf(target as HTMLInputElement);
        if (index === -1)
            return;
        e.preventDefault();
        const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
        inputs[(index + delta + inputs.length) % inputs.length]?.focus();
    };
    const labelId = `${React.useId()}-label`;
    return (<div role="group" aria-label={label === undefined ? ariaLabel : undefined} aria-labelledby={label === undefined ? undefined : labelId} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} onKeyDown={handleKeyDown}>
      {label !== undefined && (<span id={labelId} className={classNames?.groupLabel}>
          {label}
        </span>)}
      {options.map((item) => "group" in item ? (<div className={classNames?.section} key={item.group}>
            <span className={classNames?.label}>{item.group}</span>
            {item.options.map((option) => (<Checkbox key={option.value} value={option.value} disabled={disabled || option.disabled} name={name} checked={selectedSet.has(option.value)} onCheckedChange={() => handleToggle(option.value)} lineThrough={option.lineThrough ?? common?.lineThrough} classNames={option.classNames ?? common?.classNames} styles={option.styles ?? common?.styles} indicator={option.indicator ?? common?.indicator}>
                {option.label}
              </Checkbox>))}
          </div>) : (<Checkbox key={item.value} value={item.value} disabled={disabled || item.disabled} name={name} checked={selectedSet.has(item.value)} onCheckedChange={() => handleToggle(item.value)} lineThrough={item.lineThrough ?? common?.lineThrough} classNames={item.classNames ?? common?.classNames} styles={item.styles ?? common?.styles} indicator={item.indicator ?? common?.indicator}>
            {item.label}
          </Checkbox>))}
    </div>);
}
