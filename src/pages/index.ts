import { lazy } from "react";
import {App} from "./app";
import Introduction from "./introduction";

export { App, Introduction };
export const Accordion = lazy(() => import("./accordion"));
export const Anchor = lazy(() => import("./anchor"));
export const Button = lazy(() => import("./button"));
export const Checkbox = lazy(() => import("./checkbox"));
export const Description = lazy(() => import("./description"));
export const DropdownMenu = lazy(() => import("./dropdown-menu"));
export const Input = lazy(() => import("./input"));
export const Password = lazy(() => import("./password"));
export const Radio = lazy(() => import("./radio"));
export const Toast = lazy(() => import("./toast"));

export * from "./config";
