"use client";
import { AvatarRoot, AvatarImage } from "@/ui";

export default function AvatarAtomicDemo() {
  return (
    <AvatarRoot className="w-14 h-14 rounded-full bg-muted overflow-hidden">
      <AvatarImage
        src="https://picsum.photos/seed/av1/200/200"
        alt="user avatar"
        className="object-cover"
      />
    </AvatarRoot>
  );
}
