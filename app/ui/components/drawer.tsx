"use client";
import * as React from "react";
import { trapTabKey } from "../utils/trap-tab-key";
import { getTransitionDurationMs } from "../utils/scheme-duration";
export type DrawerSize = "sm" | "md" | "lg";
export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerOrientation = "horizontal" | "vertical";
const transformMap: Record<DrawerPlacement, string> = {
    left: "translateX(-100%)",
    right: "translateX(100%)",
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
};
export type DrawerRootProps = Omit<React.ComponentProps<"dialog">, "className"> & {
    className?: string;
};
export function DrawerRoot(props: DrawerRootProps) {
    return <dialog {...props}/>;
}
export type DrawerStageProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
    placement: DrawerPlacement;
};
export function DrawerStage({ placement, ...props }: DrawerStageProps) {
    return (<div {...props} data-placement={placement}/>);
}
export type DrawerWrapperProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
    size?: DrawerSize;
    placement: DrawerPlacement;
};
export function DrawerWrapper({ size = "md", placement, className, ...props }: DrawerWrapperProps) {
    return (<div {...props} data-placement={placement} data-size={size} className={className}/>);
}
export type DrawerDragProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
    orientation?: DrawerOrientation;
};
export function DrawerDrag({ orientation = "horizontal", className, ...props }: DrawerDragProps) {
    return (<div {...props} data-orientation={orientation} className={className}/>);
}
export type DrawerContentProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
    orientation?: DrawerOrientation;
};
export function DrawerContent({ orientation, children, ...props }: DrawerContentProps) {
    return (<div {...props} data-orientation={orientation}>
      {children}
    </div>);
}
export interface DrawerDragApi {
    isDragging: boolean;
    handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}
export interface DrawerProps extends Omit<DrawerWrapperProps, "classNames" | "styles"> {
    drag?: DrawerDragApi;

    classNames?: {
        stage?: string;
        wrapper?: string;
        drag?: string;
        content?: string;
    };
    styles?: {
        stage?: React.CSSProperties;
        wrapper?: React.CSSProperties;
        drag?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    onCancel?: (e: React.SyntheticEvent<HTMLDialogElement>) => void;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    onBackdropClick?: (e: React.MouseEvent<HTMLDialogElement>) => void;
}
export function Drawer({ className, style, classNames, styles, size, placement = "right", open, onOpenChange, onCancel, children, drag, ref, onBackdropClick, ...props }: DrawerProps) {
    const isHorizontal = placement === "left" || placement === "right";
    const orientation: DrawerOrientation = isHorizontal ? "horizontal" : "vertical";
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const openRef = React.useRef(open);
    React.useLayoutEffect(() => {
        const dialog = dialogRef.current;
        const wrapper = wrapperRef.current;
        openRef.current = open;
        if (!dialog || !wrapper)
            return;
        if (open) {
            if (!dialog.open) {
                dialog.showModal();
            }
            wrapper.style.transform = "translate(0, 0)";
        }
        else {
            wrapper.style.transform = transformMap[placement];
            if (dialog.open) {
                const timer = window.setTimeout(() => {
                    if (!openRef.current && dialog.open) {
                        dialog.close();
                    }
                }, getTransitionDurationMs(wrapper) || 1);
                return () => window.clearTimeout(timer);
            }
        }
    }, [open, placement]);
    const handleClose = React.useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);
    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.propertyName === "transform" && !openRef.current && dialogRef.current?.open) {
            dialogRef.current.close();
        }
    };
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        handleClose();
        onCancel?.(e);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
        trapTabKey(e, dialogRef.current);
    };
    const setRefs = (element: HTMLDivElement | null) => {
        wrapperRef.current = element;
        if (typeof ref === "function") {
            ref(element);
        }
        else if (ref !== null && ref !== undefined) {
            ref.current = element;
        }
    };
    return (<DrawerRoot ref={dialogRef} className={className} style={style} onKeyDown={handleKeyDown} onCancel={handleCancel} onClick={(e) => {
            if (e.target === e.currentTarget) {
                onOpenChange(false);
                onBackdropClick?.(e);
            }
        }}>
      <DrawerStage placement={placement} className={classNames?.stage} style={styles?.stage}>
        <DrawerWrapper {...props} ref={setRefs} size={size} placement={placement} onTransitionEnd={handleTransitionEnd} className={classNames?.wrapper} style={styles?.wrapper}>
          
          {drag && <DrawerDrag orientation={orientation} className={classNames?.drag} style={styles?.drag} onPointerDown={drag.handlePointerDown}/>}
          <DrawerContent orientation={orientation} className={classNames?.content} style={styles?.content}>
            {children}
          </DrawerContent>
        </DrawerWrapper>
      </DrawerStage>
    </DrawerRoot>);
}
