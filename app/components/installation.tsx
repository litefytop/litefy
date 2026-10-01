"use client";

import * as React from "react";
import { useLocation } from "react-router";
import { Tabs, type TabsOptionConfig } from "@/ui";
import { PackageManagerTabs } from "./package-manager-tabs";
import { Source } from "./source";

export interface InstallationProps {
  /** Registry name — e.g. "avatar", "date-picker", "use-load-more", "preset". */
  name: string;
  /** Overrides the Source type. Defaults to `"util"` for `use-*` names, `"css"` for `style-*`/`preset` names, otherwise `"component"`. */
  type?: "component" | "util" | "css";
}

// Single entry point for the docs "Installation" section: merges the
// CLI / Manual tabs, the package-manager commands and the source viewer.
// Locale is detected from the docs path (/zh/** gets the 手动 tab label).
// The whole-package `preset` has no single source file to show, so it is
// CLI-only; per-file sources render through <Source>.
export function Installation({ name, type }: InstallationProps) {
  const { pathname } = useLocation();
  const zh = pathname.startsWith("/zh");
  const sourceType =
    type ?? (name.startsWith("use-") ? "util" : name.startsWith("style-") || name === "preset" ? "css" : "component");
  const sourceName = sourceType === "css" ? name.replace(/^style-/, "") : name;

  const items: TabsOptionConfig[] = [
    {
      value: "cli",
      label: "CLI",
      content: <PackageManagerTabs command={`litefy@latest add ${name}`} />,
    },
    ...(name === "preset"
      ? []
      : [
          {
            value: "manual",
            label: zh ? "手动" : "Manual",
            content: <Source type={sourceType} name={sourceName} />,
          },
        ]),
  ];

  return <Tabs options={items} className="border" />;
}
