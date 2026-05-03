import { lazy } from "react";

export const Home = lazy(() => import("./Home"));

export const Accordion = lazy(() => import("./accordion/page"));
export const Anchor = lazy(() => import("./anchor/page"));
export const Button = lazy(() => import("./button/page"));
export const Checkbox = lazy(() => import("./checkbox/page"));
export const Description = lazy(() => import("./description/page"));
export const DropdownMenu = lazy(() => import("./dropdown-menu/page"));
export const Input = lazy(() => import("./input/page"));
export const Password = lazy(() => import("./password/page"));
export const Radio = lazy(() => import("./radio/page"));

export * from "./config";

