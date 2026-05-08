import { Input } from "@/component";

export default function InputError() {
  return (
    <div className="space-y-4 w-80">
      <Input 
        label="Email"
        placeholder="Enter your email"
        error="Please enter a valid email address"
      />
      <Input 
        label="Email"
        placeholder="Enter your email"
        invalid
      />
    </div>
  );
}
