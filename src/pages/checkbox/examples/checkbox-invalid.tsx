import { Checkbox } from "@/component";

export default function CheckboxInvalid() {
  return (
   <div className="flex flex-col gap-4">
     <Checkbox.Group invalid>
      <Checkbox value="remember" >Remember me</Checkbox>
      <Checkbox value="agree" >Agree to terms</Checkbox>
      <Checkbox value="news" >Subscribe to newsletter</Checkbox>
    </Checkbox.Group>
       <Checkbox.Group 
      invalid 
      className="gap-0 w-full items-center justify-center"
    >
      <Checkbox
        value="a"
        variant="toggle"
        indicator={{ hidden: true }}
        className="rounded-l-full rounded-tr-none rounded-br-none"
      >
        toggle A
      </Checkbox>
      <Checkbox
        value="b"
        variant="toggle"
        indicator={{ hidden: true }}
        className="rounded-none"
      >
        toggle B
      </Checkbox>
      <Checkbox
        value="c"
        variant="toggle"
        indicator={{ hidden: true }}
        className="rounded-r-full rounded-tl-none rounded-bl-none"
      >
        toggle C
      </Checkbox>
    </Checkbox.Group>
   </div>
  );
}
