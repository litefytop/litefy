import { useState } from "react";
import { Password } from "@/ui";

export default function PasswordControlledDemo() {
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
      />
      <p className="text-sm text-muted-foreground">
        Password length: {password.length}
      </p>
    </div>
  );
}
