"use client";
import { Avatar } from "@/ui";

export default function AvatarDemo() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="https://picsum.photos/seed/av1/200/200"
        alt="user avatar"
        className="w-14 h-14 rounded-full"
        skeleton={<div className="bg-muted animate-pulse" />}
      />

      <Avatar
        src="https://invalid-url-notfound/image.png"
        alt="broken avatar"
        className="w-14 h-14 rounded-full bg-muted "
        skeleton={<div className="bg-muted animate-pulse" />}
        fallback={<div className="flex items-center justify-center text-muted-foreground font-bold">User</div>}
      />

      <Avatar
        src="https://picsum.photos/seed/av2/200/200"
        alt="custom wrapper avatar"
        className="w-14 h-14 rounded-full"
  
      />
    </div>
  );
}
