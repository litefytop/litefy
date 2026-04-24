"use client";

import { useTabs } from "@/components";
import { Segment, SegmentProps} from "@/components";

export type TabsListProps = SegmentProps<string>;

export function TabsList({  ...props }: TabsListProps) {
  const { value, setValue } = useTabs();

  return (
    <Segment
      outline={false}
      rounded={false}
      value={value}
      onValueChange={setValue}
      {...props}
    >
      {props.children}
    </Segment>
  );
}
