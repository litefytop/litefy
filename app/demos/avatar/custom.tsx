"use client";
import * as React from "react";
import { AvatarImage, AvatarRoot } from "@/ui";

export default function AvatarCustomDemo() {
  const [circleStatus, setCircleStatus] = React.useState<"loading" | "loaded" | "error">("loading");
  const [squareStatus, setSquareStatus] = React.useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className="flex gap-4 items-center">
      <AvatarRoot className="w-16 h-16 rounded-full bg-muted ring-2 ring-primary/50">
        {circleStatus === "loading" && <div className="w-full h-full bg-muted animate-pulse" />}
        {circleStatus === "error" && (
          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
            L
          </div>
        )}
        {circleStatus === "loaded" && (
          <AvatarImage
            src="https://picsum.photos/seed/av3/200/200"
            alt="circle avatar"
            onLoad={() => setCircleStatus("loaded")}
            onError={() => setCircleStatus("error")}
          />
        )}
      </AvatarRoot>

      <div className="relative">
        <AvatarRoot className="w-16 h-16 rounded-xl bg-muted">
          {squareStatus === "loading" && <div className="w-full h-full bg-muted animate-pulse" />}
          {squareStatus === "error" && (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
              ?
            </div>
          )}
          {squareStatus === "loaded" && (
            <AvatarImage
              src="https://invalid-url-notfound/image.png"
              alt="square avatar"
              onLoad={() => setSquareStatus("loaded")}
              onError={() => setSquareStatus("error")}
            />
          )}
        </AvatarRoot>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border-2 border-background" />
      </div>
    </div>
  );
}
