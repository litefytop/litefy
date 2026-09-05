"use client";

import { useRef } from "react";
import { Button, Form, Input } from "@/ui";

export default function FormImperativeDemo() {
  const formRef = useRef<React.ComponentRef<typeof Form>>(null);

  return (
    <div className="w-sm space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            formRef.current?.setValues({
              name: "Jane Doe",
              email: "jane@example.com",
            });
          }}
        >
          Fill sample
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            formRef.current?.reset();
          }}
        >
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            formRef.current?.submit();
          }}
        >
          Submit
        </Button>
      </div>

      <Form
        ref={formRef}
        className="space-y-4"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 600));
          return true;
        }}
      >
        <Form.Field name="name" label="Name">
          {(field) => <Input {...field} />}
        </Form.Field>
        <Form.Field name="email" label="Email">
          {(field) => <Input {...field} type="email" />}
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form>
    </div>
  );
}
