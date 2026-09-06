"use client";

import { Megaphone, Sparkles, Zap } from "lucide-react";
import { BannerItem, BannerTrack, BannerViewport } from "@/ui";

const messages = [
  { icon: Megaphone, text: "Server maintenance Sunday 02:00 UTC" },
  { icon: Sparkles, text: "Banner component just landed" },
  { icon: Zap, text: "Anchor positioning powers every popover" },
];

export default function BannerCustomDemo() {
  return (
    <div className="w-full max-w-md rounded-md border bg-background">
      <BannerViewport className="py-2" aria-label="Announcements">
        <BannerTrack duration={12} direction="right" playing>
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy > 0 || undefined}
              className="flex shrink-0 items-center"
            >
              {messages.map(({ icon: Icon, text }) => (
                <BannerItem key={text} className="gap-2 px-6 text-sm">
                  <Icon className="size-3.5 text-primary" />
                  <span className="whitespace-nowrap">{text}</span>
                </BannerItem>
              ))}
            </div>
          ))}
        </BannerTrack>
      </BannerViewport>
    </div>
  );
}
