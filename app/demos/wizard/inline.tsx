"use client";

import * as React from "react";
import { InlineWizard } from "@/ui/skins";
import { Input } from "@/ui/skins";

export default function Demo() {
  const [username, setUsername] = React.useState("");
  const [finished, setFinished] = React.useState(false);

  return (
    <div className="mx-auto">
      <InlineWizard
        steps={[
          {
            title: "Account",
            description: "Create your login",
            content: (
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            ),
          },
          {
            title: "Profile",
            description: "Tell us a bit about yourself",
            content: (
              <p>
                Profile details would be collected here.
              </p>
            ),
          },
          {
            title: "Confirm",
            description: "Review and finish",
            content: (
              <p>
                Review your setup for <span>{username || "—"}</span>.
              </p>
            ),
          },
        ]}
        onFinish={() => setFinished(true)}
      />
      {finished && (
        <p>Wizard finished — reload to restart.</p>
      )}
    </div>
  );
}
