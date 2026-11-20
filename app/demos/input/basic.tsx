"use client";

import { Mail, Phone, Search } from "@/components/icons";
import { Input } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Input
        type="email"
        placeholder="Enter email"
        leading={<Mail className="size-4" />}
        className="w-77 min-w-33"
      />
      <Input type="search" placeholder="Search..." leading={<Search className="size-4" />} className="w-77 min-w-33" />
      <Input type="tel" placeholder="Enter phone" leading={<Phone className="size-4" />} className="w-77 min-w-33" />
    </div>
  );
}
