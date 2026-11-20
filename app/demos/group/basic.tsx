"use client";

import { Button, Group } from "@/ui/skins";

export default function Demo() {
  return (
    <Group aria-label="时间范围">
      <Button data-variant="outline">Day</Button>
      <Button data-variant="outline">Week</Button>
      <Button data-variant="outline">Month</Button>
    </Group>
  );
}
