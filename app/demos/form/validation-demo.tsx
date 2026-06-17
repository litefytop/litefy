"use client";

import { Form, Input } from "@/ui";

export default function FormValidationDemo() {
  return (
    <Form
      className="w-sm space-y-4"
      onSubmit={async () => {
        await new Promise((r) => setTimeout(r, 600));
        return true;
      }}
    >
      <Form.Field
        name="username"
        label="Username"
        description="At least 3 characters"
        validConfig={{
          validate: (e) => {
            const v = e.target.value;
            if (v.length === 0) return "Username is required";
            if (v.length < 3) return "Must be at least 3 characters";
            return null;
          },
          trigger: "onChange",
        }}
      >
        {(field) => <Input {...field} placeholder="Pick a username" />}
      </Form.Field>
      <Form.Field
        name="email"
        label="Email"
        validConfig={{
          validate: (e) => {
            const v = e.target.value;
            if (v.length === 0) return "Email is required";
            if (!/.+@.+\..+/.test(v)) return "Enter a valid email";
            return null;
          },
          trigger: "onBlur",
        }}
      >
        {(field) => (
          <Input {...field} type="email" placeholder="you@example.com" />
        )}
      </Form.Field>
      <Form.Submit>Sign up</Form.Submit>
    </Form>
  );
}
