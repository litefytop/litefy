"use client";

import { Wizard } from "@/ui";

const steps = [{ title: "Account" }, { title: "Profile" }, { title: "Confirm" }];

export default function WizardBasicDemo() {
  return (
    <Wizard steps={steps} onFinish={() => window.alert("Submitted")}>
      <form className="flex h-full w-full flex-col justify-center gap-3 rounded-lg border p-4">
        <label className="text-sm font-medium">Email</label>
        <input
          className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="you@example.com"
        />
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="••••••••"
        />
      </form>
      <form className="flex h-full w-full flex-col justify-center gap-3 rounded-lg border p-4">
        <label className="text-sm font-medium">Display name</label>
        <input
          className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Your name"
        />
        <label className="text-sm font-medium">Bio</label>
        <textarea
          className="min-h-16 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Tell something about yourself"
        />
      </form>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4">
        <p className="text-sm font-medium">Ready to submit</p>
        <p className="max-w-64 text-center text-sm text-muted-foreground">
          Review your account and profile information, then submit the form.
        </p>
      </div>
    </Wizard>
  );
}
