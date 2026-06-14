"use client";

import { Mail, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui";

export default function InputWithIconsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="email" placeholder="Enter email" leading={<Mail />} />
      <Input type="search" placeholder="Search..." leading={<Search />} />
      <Input type="tel" placeholder="Enter phone" leading={<Phone />} />
    </div>
  );
}
