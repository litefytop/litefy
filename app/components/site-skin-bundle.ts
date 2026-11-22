import type { ComponentType } from "react";
import {
  Button,
  Callout,
  Card,
  Command,
  Drawer,
  DropdownMenu,
  Image,
  Input,
  Menu,
  NumberInput,
  Popover,
  Radio,
  SegmentGroup,
  Sidebar,
  Slider,
  Tabs,
  Toaster,
  Toc,
  Tree,
  buttonVariants,
  cardButtonClasses,
  cardClasses,
  chipClasses,
  cn,
} from "@/ui/skins";
import { buildDemoTable } from "@/lib/demo-table";

const demoModules = import.meta.glob<{ default: ComponentType }>("/app/demos/**/*.tsx");
const demoCodes = import.meta.glob<string>("/app/demos/**/*.tsx", { query: "?raw", import: "default" });

const demos = buildDemoTable(demoModules, demoCodes);

export const siteSkin = {
  Button,
  Callout,
  Card,
  Command,
  Drawer,
  DropdownMenu,
  Image,
  Input,
  Menu,
  NumberInput,
  Popover,
  Radio,
  SegmentGroup,
  Sidebar,
  Slider,
  Tabs,
  Toaster,
  Toc,
  Tree,
  buttonVariants,
  cardButtonClasses,
  cardClasses,
  chipClasses,
  cn,
  demoModules,
  demos,
};
