"use client";

import * as React from "react";
import { useLocation } from "react-router";
import { type TabsOptionConfig } from "@/ui";
import { findStyleTemplateByPath, stripSchemePrefix } from "@/lib/style-templates";
import { tabsScrollLabels } from "@/lib/shared";
import { useSiteSkin } from "./site-skin";
import { PackageManagerTabs } from "./package-manager-tabs";
import { Source } from "./source";

export interface InstallationProps {
  name: string;
}

export function Installation({ name }: InstallationProps) {
  const { Tabs } = useSiteSkin();
  const { pathname } = useLocation();
  const zh = stripSchemePrefix(pathname).startsWith("/zh");
  const scheme = findStyleTemplateByPath(pathname).slug;

  const addCommand = `litefy@latest add ${name} -s ${scheme}`;

  const items: TabsOptionConfig[] = [
    {
      value: "cli",
      label: "CLI",
      content: <PackageManagerTabs command={addCommand} />,
    },
    {
      value: "manual",
      label: zh ? "手动" : "Manual",
      content: <Source name={name} />,
    },
  ];

  return (
    <Tabs
      {...tabsScrollLabels(zh)}
      options={items}
      className="flex flex-col aspect-square md:aspect-video overflow-hidden rounded-xl border"
      panelClassName="min-h-0 flex-1 overflow-y-auto"
      classNames={{ scroller: "justify-center" }}
    />
  );
}
