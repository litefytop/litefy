"use client";

import { useRef } from "react";
import { Button, Form, FormItem } from "@/ui";

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
        <FormItem name="name" label="Name" />
        <FormItem name="email" label="Email" controlProps={{ type: "email" }} />
        <Form.Submit>Save</Form.Submit>
      </Form>
    </div>
  );
}
