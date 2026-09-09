"use client";

import * as React from "react";
import { InlineWizard } from "@/ui";

export default function Demo() {
  const [username, setUsername] = React.useState("");
  const [finished, setFinished] = React.useState(false);

  return (
    <div className="w-full max-w-md">
      <InlineWizard
        steps={[
          {
            title: "Account",
            description: "Create your login",
            content: (
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-md border bg-transparent px-2 py-1 text-sm"
              />
            ),
          },
          {
            title: "Profile",
            description: "Tell us a bit about yourself",
            content: (
              <p className="text-muted-foreground">
                Profile details would be collected here.
              </p>
            ),
          },
          {
            title: "Confirm",
            description: "Review and finish",
            content: (
              <p className="text-muted-foreground">
                Review your setup for <span className="font-medium">{username || "—"}</span>.
              </p>
            ),
          },
        ]}
        onFinish={() => setFinished(true)}
      />
      {finished && (
        <p className="mt-3 text-sm text-success">Wizard finished — reload to restart.</p>
      )}
    </div>
  );
}
