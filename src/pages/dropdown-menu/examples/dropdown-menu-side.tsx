import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/component";

export default function DropdownMenuSide() {
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>Top</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="start">
          <DropdownMenuItem>Top Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Bottom</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="end">
          <DropdownMenuItem>Bottom Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Left</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="start" y_axis="center">
          <DropdownMenuItem>Left Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Right</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="end" y_axis="center">
          <DropdownMenuItem>Right Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Custom Spacing</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="end" className="mt-2">
          <DropdownMenuItem>Menu with custom spacing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
