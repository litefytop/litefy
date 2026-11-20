"use client";
import { Avatar } from "@/ui/skins";

export default function AvatarDemo() {
  return (
    <div className="flex gap-4 justify-center">
      <Avatar src="https://picsum.photos/seed/av1/200/200" alt="user avatar" />

      {/* Undecodable data URI: exercises the failure path without a 404 in the console */}
      <Avatar src="data:image/png;base64,invalid" alt="broken avatar" fallback="US" />
    </div>
  );
}
