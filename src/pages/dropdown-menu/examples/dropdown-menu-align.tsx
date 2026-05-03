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
        <DropdownMenuTrigger>左对齐</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="start">
          <DropdownMenuItem>左对齐内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>居中</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="center">
          <DropdownMenuItem>居中内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>右对齐</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="end">
          <DropdownMenuItem>右对齐内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
