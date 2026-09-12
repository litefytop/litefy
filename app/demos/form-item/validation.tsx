"use client";

import { Form, FormItem } from "@/ui";

export default function Demo() {
  return (
    <Form className="w-md" onSubmit={async () => true}>
      <FormItem
        variant="input"
        name="repo"
        label="Repository"
        description="Required. Letters, numbers and dashes once filled."
        validate={(value) => {

          if (value === "") return { message: "Repository is required", invalid: false };

          if (!/^[a-z0-9-]+$/i.test(value)) return "Only letters, numbers and dashes";
          return null;
        }}
        controlProps={{ placeholder: "litefy-ui" }}
      />
    </Form>
  );
}
