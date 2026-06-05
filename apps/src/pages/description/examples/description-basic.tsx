import { Description } from "@/component";

export default function DescriptionBasic() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Account Information</h2>
      <Description> Please complete your account information so we can provide you with better service</Description>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2">
          Username
        </label>
        <div className="border-input bg-background flex w-full items-center rounded-md border shadow-xs outline-none has-[>input:disabled]:pointer-events-none has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-50">
          <input
            className="appearance-none bg-transparent outline-none w-full h-8 px-2 py-1 text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground"
            placeholder="Enter username"
          />
        </div>
        <Description className="py-1 indent-2">
          Username is used for login, 4-16 characters
        </Description>
      </div>
    </div>
  );
}
