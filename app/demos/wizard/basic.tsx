"use client";

import { Wizard } from "@/ui/skins";
import { Input, Password } from "@/ui/skins";

const steps = [{ title: "Account" }, { title: "Profile" }, { title: "Confirm" }];

export default function WizardBasicDemo() {
  return (
    <Wizard steps={steps} onFinish={() => window.alert("Submitted")}>
      <form className="flex flex-col gap-3">
        <Input name="email" label="Email" placeholder="you@example.com" />
        <Password name="password" label="Password" placeholder="••••••••" />
      </form>
      <form className="flex flex-col gap-3">
        <Input name="displayName" label="Display name" placeholder="Your name" />
        <Input name="bio" label="Bio" placeholder="Tell something about yourself" />
      </form>
      <div className="flex flex-col gap-3">
        <p>Ready to submit</p>
        <p>
          Review your account and profile information, then submit the form.
        </p>
      </div>
    </Wizard>
  );
}
