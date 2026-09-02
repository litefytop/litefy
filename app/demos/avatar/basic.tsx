"use client";
import { Avatar } from "@/ui";

export default function AvatarDemo() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar src="https://picsum.photos/seed/av1/200/200" alt="user avatar" />

      <Avatar
        alt="broken avatar"
        skeleton={<div className="bg-neutral animate-pulse size-full" />}
        fallback={
          <div className="flex items-center justify-center  bg-neutral text-background size-full font-bold">
            US
          </div>
        }
      />
    </div>
  );
}
