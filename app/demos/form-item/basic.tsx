"use client";

import { useRef } from "react";
import { Button, Form, FormItem, type FormRef } from "@/ui";

export default function Demo() {
  const formRef = useRef<FormRef>(null);

  return (
    <Form
      ref={formRef}
      className="w-sm space-y-4"
      onSubmit={async (values) => {
        console.log(values);
        return true;
      }}
    >
      <FormItem
        variant="input"
        name="username"
        label="Username"
        required
        description="3-16 characters"
        validate={(value) => {
          if (!value) return "Username is required";
          if (value.length < 3 || value.length > 16) return "Must be 3-16 characters";
          return null;
        }}
      />
      <FormItem
        variant="password"
        name="password"
        label="Password"
        required
        validate={(value) => (value.length >= 8 ? null : "At least 8 characters")}
      />
      <FormItem
        variant="select"
        name="role"
        label="Role"
        validate={(value) => (value ? null : "Pick a role")}
        controlProps={{
          options: [
            { label: "Developer", value: "developer" },
            { label: "Designer", value: "designer" },
          ],
        }}
      />
      <FormItem
        variant="number-input"
        name="age"
        label="Age"
        validateTrigger="onChange"
        validate={(value) => {
          if (!value) return null;
          const n = Number(value);
          return Number.isFinite(n) && n >= 1 && n <= 120 ? null : "1-120";
        }}
      />
      <div className="flex gap-2 pt-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={() => formRef.current?.reset()}>
          Reset
        </Button>
      </div>
    </Form>
  );
}
