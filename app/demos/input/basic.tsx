"use client";

import { Mail, Phone, Search } from "@/components/icons";
import { Input } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Input
        type="email"
        placeholder="Enter email"
        leading={<Mail className="size-4" />}
      />
      <Input type="search" placeholder="Search..." leading={<Search className="size-4" />} />
      <Input type="tel" placeholder="Enter phone" leading={<Phone className="size-4" />} />
    </div>
  );
}
