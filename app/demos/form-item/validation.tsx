"use client";

import { Form, FormItem } from "@/ui";

export default function Demo() {
  return (
    <Form className="w-full max-w-md" onSubmit={async () => true}>
      <FormItem
        variant="input"
        name="repo"
        label="Repository"
        description="Required. Letters, numbers and dashes once filled."
        validate={(value) => {
          // Empty → message only, the control keeps its normal border.
          if (value === "") return { message: "Repository is required", invalid: false };
          // Filled but wrong → message + danger styling on the control.
          if (!/^[a-z0-9-]+$/i.test(value)) return "Only letters, numbers and dashes";
          return null;
        }}
        controlProps={{ placeholder: "litefy-ui" }}
      />
    </Form>
  );
}
