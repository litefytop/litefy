"use client";

import { Form, Input } from "@/ui";

export default function FormHorizontalDemo() {
  return (
    <Form
      className="w-md space-y-2"
      onSubmit={async () => {
        await new Promise((r) => setTimeout(r, 500));
        return true;
      }}
    >
      <Form.Field
        name="email"
        label="Email"
        direction="horizontal"
        slotProps={{
          label: { className: "w-24 text-muted-foreground" },
          description: { className: "text-xs" },
        }}
      >
        {(field) => <Input {...field} type="email" />}
      </Form.Field>
      <Form.Field
        name="phone"
        label="Phone"
        direction="horizontal"
        slotProps={{
          label: { className: "w-24 text-muted-foreground" },
        }}
      >
        {(field) => <Input {...field} type="tel" placeholder="+1 555 1234" />}
      </Form.Field>
      <Form.Submit className="ml-24">Save</Form.Submit>
    </Form>
  );
}
