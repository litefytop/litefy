"use client";

import { useRef } from "react";
import { Form, type FormRef } from "@/ui/skins";
import { Button, FormSubmit, RadioGroup } from "@/ui/skins";
import { Input, Password } from "@/ui/skins";

export default function Demo() {
  const formRef = useRef<FormRef>(null);

  const handleSubmit = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return true;
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <RadioGroup
        name="plan"
        label="Plan"
        orientation="horizontal"
        defaultValue="pro"
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Team", value: "team" },
        ]}
      />

      <Input
        name="name"
        label="Name"
        description="At least 3 characters"
        validate={(value) => {
          if (value.length === 0) return "Name is required";
          if (value.length < 3) return "Must be at least 3 characters";
          return null;
        }}
        placeholder="Enter your name"
      />

      <Password
        name="password"
        label="Password"
        description="At least 6 characters"
        validate={(value) => {
          if (value.length === 0) return "Password is required";
          if (value.length < 6) return "Must be at least 6 characters";
          return null;
        }}
        placeholder="Enter your password"
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          data-variant="outline"
          onClick={() => {
            formRef.current?.setValues({
              name: "Jane Doe",
              plan: "pro",
            });
          }}
        >
          Fill sample
        </Button>
        <Button type="button" data-variant="outline" onClick={() => formRef.current?.reset()}>
          Reset
        </Button>
        <FormSubmit>Submit</FormSubmit>
      </div>
    </Form>
  );
}
