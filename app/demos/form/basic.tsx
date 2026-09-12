"use client";

import { useRef } from "react";
import { Button, Checkbox, Form, FormItem, type FormRef, type FormValues, Radio } from "@/ui";

export default function Demo() {
  const formRef = useRef<FormRef>(null);

  const handleSubmit = async (values: FormValues) => {
    console.log("submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            formRef.current?.setValues({
              name: "Jane Doe",
              email: "jane@example.com",
              interests: ["reading", "music"],
              contact: "email",
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
      </div>

      <Form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <FormItem name="name" label="Name" controlProps={{ placeholder: "Enter your name" }} />
        <FormItem
          name="email"
          label="Email"
          controlProps={{ type: "email", placeholder: "Enter your email" }}
        />

        <div className="space-y-1">
          <span className="block text-sm font-medium indent-2 select-none">Interests</span>
          <Checkbox.Group
            name="interests"
            options={[
              { label: "Reading", value: "reading" },
              { label: "Music", value: "music" },
              { label: "Sports", value: "sports" },
            ]}
          />
        </div>

        <div className="space-y-1">
          <span className="block text-sm font-medium indent-2 select-none">Contact preference</span>
          <Radio.Group
            name="contact"
            className="flex-row"
            options={[
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "SMS", value: "sms" },
            ]}
          />
        </div>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    </div>
  );
}
