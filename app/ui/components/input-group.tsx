import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useAutoId } from "../utils/use-auto-id";
type HTMLAttrs<T> = Omit<T, "className"> & {
    [key: `data-${string}`]: string | number | null | undefined | true;
    className?: ClassNameValue;
};
export interface InputGroupProps extends HTMLAttrs<React.ComponentProps<"div">> {
    invalid?: boolean;
}
export function InputGroup({ className, invalid, ...props }: InputGroupProps) {
    return (<div {...props} data-invalid={invalid || props["data-invalid"]} className={cn("group/input flex h-9 rounded-md px-2 border shadow-base items-center", "focus-within:outline-1 focus-within:outline-outline focus-within:ring-ring/50 focus-within:ring-3", "[&_input]:outline-none [&_input:focus]:outline-none [&_input:focus]:shadow-none [&_input:focus]:ring-0 [&_input:focus-visible]:outline-none [&_input:focus-visible]:shadow-none [&_input:focus-visible]:ring-0", "[&_button:focus]:outline-none [&_button:focus]:shadow-none [&_button:focus]:ring-0 [&_button:focus-visible]:outline-none [&_button:focus-visible]:shadow-none [&_button:focus-visible]:ring-0", "[&_textarea]:outline-none [&_textarea:focus]:outline-none [&_textarea:focus]:shadow-none [&_textarea:focus]:ring-0 [&_textarea:focus-visible]:outline-none [&_textarea:focus-visible]:shadow-none [&_textarea:focus-visible]:ring-0", "[&_[role=combobox]:focus]:outline-none [&_[role=combobox]:focus]:shadow-none [&_[role=combobox]:focus]:ring-0 [&_[role=combobox]:focus-visible]:outline-none [&_[role=combobox]:focus-visible]:shadow-none [&_[role=combobox]:focus-visible]:ring-0", "data-invalid:border-danger data-invalid:focus-within:outline-none data-invalid:focus-within:ring-3 data-invalid:focus-within:ring-danger/50", className)}/>);
}
export type InputLeadingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputLeading({ className, ...props }: InputLeadingProps) {
    return (<span {...props} className={cn("shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2", className)}/>);
}
export type InputRootProps = Omit<React.ComponentProps<"input">, "className"> & {
    className?: ClassNameValue;
};
export function InputRoot({ className, ...props }: InputRootProps) {
    const id = useAutoId(props.id);
    return (<input {...props} id={id} className={cn("flex-1 border-0 ring-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground", "group-data-invalid/input:text-danger", className)}/>);
}
export type InputTrailingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputTrailing({ className, ...props }: InputTrailingProps) {
    return (<span {...props} className={cn("shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2", className)}/>);
}
