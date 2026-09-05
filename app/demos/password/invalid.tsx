import { Password } from "@/ui";

export default function PasswordInvalidDemo() {
  return (
    <Password
      placeholder="Enter password..."
      invalid
      defaultValue="incorrect"
    />
  );
}
