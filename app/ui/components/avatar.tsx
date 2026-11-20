"use client";
import * as React from "react";
import { useImageStatus } from "../utils/use-image-status";
export interface AvatarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function AvatarRoot(props: AvatarRootProps) {
    return (<div {...props}/>);
}
export interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "className"> {
    className?: string;
}
export function AvatarImage(props: AvatarImageProps) {
    return (<img {...props} loading="lazy" decoding="async"/>);
}
export interface AvatarProps extends Omit<AvatarImageProps, "className" | "style"> {
    className?: string;
    style?: React.CSSProperties;
    skeleton?: React.ReactNode;
    fallback?: React.ReactNode;
    classNames?: {
        image?: string;
    };
    styles?: {
        image?: React.CSSProperties;
    };
}
export function Avatar({ className, style, skeleton, fallback, src, classNames, styles, ...props }: AvatarProps) {
    const status = useImageStatus(src);
    return (<AvatarRoot className={className} style={style}>
      {status === "loading" && skeleton}
      {status === "failure" && fallback}
      {status === "success" && (<AvatarImage {...props} src={src} className={classNames?.image} style={styles?.image}/>)}
    </AvatarRoot>);
}
