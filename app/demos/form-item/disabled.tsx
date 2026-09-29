"use client";

import { Form, FormItem } from "@/ui";

export default function FormItemDisabledDemo() {
  return (
    <Form className="w-sm space-y-4" onSubmit={async () => true}>
      <FormItem
        variant="input"
        name="username"
        label="Username"
        required
        description="3-16 characters"
      />
      <FormItem
        variant="select"
        name="plan"
        label="Plan"
        disabled
        controlProps={{
          defaultValue: "free",
          options: [
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
          ],
        }}
      />
    </Form>
  );
}
