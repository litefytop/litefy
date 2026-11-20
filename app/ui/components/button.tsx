"use client";
import React from "react";
import { cn } from "../utils/cn";

export type ButtonStatus = {
    icon: React.ReactNode;
    active: boolean;
};

export interface ButtonRootProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
    "data-pure-icon"?: true;
}

function ButtonRoot({ className, children, style, "data-pure-icon": pureIcon, ...props }: ButtonRootProps) {
    return (
        <button
            {...props}
            data-pure-icon={pureIcon ?? (children === null || children === undefined || undefined)}
            className={className}
            style={style}
        >
            {children}
        </button>
    );
}

export interface ButtonProps extends ButtonRootProps {
    icon?: React.ReactNode;
    status?: ButtonStatus;
}

function Button({ icon, status, className, children, ...props }: ButtonProps) {
    const leading = status ? (status.active ? status.icon : icon) : icon;
    const reserve = status !== undefined && !status.active && icon === undefined && children !== null && children !== undefined;
    return (
        <ButtonRoot
            {...props}
            data-pure-icon={children === null || children === undefined || undefined}
            data-status={status ? "" : undefined}
            data-status-reserve={reserve ? "" : undefined}
            className={cn("data-[status]:inline-grid data-[status]:auto-cols-auto data-[status]:grid-flow-col", className)}
        >
            {leading}
            {children}
        </ButtonRoot>
    );
}

export { Button, ButtonRoot };
