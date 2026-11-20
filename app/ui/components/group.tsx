"use client";
import * as React from "react";
export interface GroupRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function GroupRoot(props: GroupRootProps) {
    return (<div role="group" {...props}/>);
}
export interface GroupProps extends Omit<GroupRootProps, "className"> {
    className?: string;
    classNames?: {
        root?: string;
    };
}
export function Group({ className, classNames, children, ...props }: GroupProps) {
    return (<GroupRoot {...props} className={classNames?.root ?? className}>
      {children}
    </GroupRoot>);
}
