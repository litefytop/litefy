"use client";

import { InlineWizard } from "@/ui";

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <InlineWizard
        disabled
        onFinish={() => {}}
        steps={[
          {
            title: "Account",
            description: "Create your login",
            content: (
              <p className="text-sm text-muted-foreground">
                Back and Continue are frozen while the account is being verified.
              </p>
            ),
          },
          {
            title: "Profile",
            description: "Tell us about yourself",
            content: (
              <p className="text-sm text-muted-foreground">
                Profile details would be collected here.
              </p>
            ),
          },
          {
            title: "Confirm",
            description: "Review and finish",
            content: (
              <p className="text-sm text-muted-foreground">
                Review your setup to finish.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
