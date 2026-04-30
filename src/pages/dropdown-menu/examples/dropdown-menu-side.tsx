import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components";

export default function DropdownMenuSide() {
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>上边</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="start">
          <DropdownMenuItem>上边内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>下边</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="end">
          <DropdownMenuItem>下边内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>左边</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="start" y_axis="center">
          <DropdownMenuItem>左边内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>右边</DropdownMenuTrigger>
        <DropdownMenuContent x_axis="end" y_axis="center">
          <DropdownMenuItem>右边内容</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>自定义间距</DropdownMenuTrigger>
        <DropdownMenuContent y_axis="end" className="mt-2">
          <DropdownMenuItem>带自定义间距的菜单</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
