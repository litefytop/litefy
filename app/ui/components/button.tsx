import { Loader2 } from "lucide-react";
import React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
export type ButtonVariant = "primary" | "danger" | "outline" | "text";
export type ButtonLoadingConfig = {
    loading?: boolean;
    icon?: React.ReactNode;
};
export interface ButtonProps extends Omit<React.ComponentProps<"button">, "className"> {
    variant?: ButtonVariant;
    className?: ClassNameValue;
    loadingConfig?: ButtonLoadingConfig;
}
function isIconOnly(children: React.ReactNode): boolean {
    const arr = React.Children.toArray(children);
    return arr.length === 1 && React.isValidElement(arr[0]);
}
function Button({ variant = "primary", className, loadingConfig, children, ...props }: ButtonProps) {
    const { loading: isLoading, icon: customLoadingIcon } = loadingConfig || {};
    const loadingIcon = customLoadingIcon || <Loader2 className="animate-spin"/>;
    const isPureIcon = !isLoading && isIconOnly(children);
    return (<button {...props} className={cn("litefy-button", `litefy-button-${variant}`, className)} aria-busy={isLoading} data-pure-icon={isPureIcon || undefined} disabled={isLoading || props.disabled}>
      {isLoading && loadingIcon}
      {children}
    </button>);
}
export { Button };
