import { Description } from "@/components";

export default function DescriptionBasic() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">账户信息</h2>
      <Description>描述：请完善您的账户信息，以便我们为您提供更好的服务</Description>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2">
          用户名
        </label>
        <div className="border-input bg-background flex w-full items-center rounded-md border shadow-xs outline-none has-[>input:disabled]:pointer-events-none has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-50">
          <input
            className="appearance-none bg-transparent outline-none w-full h-8 px-2 py-1 text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground"
            placeholder="请输入用户名"
          />
        </div>
        <Description className="py-1 indent-2">
          描述：用户名用于登录，长度为 4-16 个字符
        </Description>
      </div>
    </div>
  );
}
