import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/component";

export default function DropdownMenuAlign() {
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>Left Align</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="start">
          <DropdownMenuItem>Left Aligned Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Center</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="center">
          <DropdownMenuItem>Centered Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>Right Align</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="end">
          <DropdownMenuItem>Right Aligned Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
