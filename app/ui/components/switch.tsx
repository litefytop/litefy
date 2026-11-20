import * as React from "react";
export interface SwitchRootProps extends Omit<React.ComponentProps<"input">, "type" | "className"> {
    className?: string;
}
export function SwitchRoot(props: SwitchRootProps) {
    return <input {...props} type="checkbox"/>;
}
export interface SwitchTrackProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
    checked?: boolean;
}
export function SwitchTrack({ className, checked, ...props }: SwitchTrackProps) {
    return (<span {...props} data-checked={checked || undefined} className={className}/>);
}
export interface SwitchThumbProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
    checked?: boolean;
}
export function SwitchThumb({ className, checked, ...props }: SwitchThumbProps) {
    return (<span {...props} data-checked={checked || undefined} className={className}/>);
}
export interface SwitchLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
    className?: string;
}
export function SwitchLabel(props: SwitchLabelProps) {
    return <label {...props}/>;
}
export interface SwitchProps extends Omit<SwitchRootProps, "className"> {
    onCheckedChange?: (checked: boolean) => void;
    classNames?: {
        label?: string;
        track?: string;
        thumb?: string;
        input?: string;
    };
    styles?: {
        label?: React.CSSProperties;
        track?: React.CSSProperties;
        thumb?: React.CSSProperties;
        input?: React.CSSProperties;
    };
}
export const Switch = ({ children, checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, classNames, styles, ...props }: SwitchProps) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled)
            setUncontrolledChecked(next);
        onCheckedChange?.(next);
    };
    return (<SwitchLabel className={classNames?.label} style={styles?.label}>
      <SwitchTrack checked={checked} className={classNames?.track} style={styles?.track}>
        <SwitchRoot {...props} className={classNames?.input} checked={checked} disabled={disabled} onChange={handleChange}/>
        <SwitchThumb checked={checked} className={classNames?.thumb} style={styles?.thumb}/>
      </SwitchTrack>
      {children}
    </SwitchLabel>);
};
