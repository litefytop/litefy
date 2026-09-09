"use client";

import { useRef } from "react";
import { Checkbox, Form, FormItem, type FormRef, type FormValues, Input, Radio } from "@/ui";

export default function Demo() {
  const formRef = useRef<FormRef>(null);

  const handleSubmit = async (values: FormValues) => {
    console.log("submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  const loadData = () => {
    formRef.current?.setValues({
      name: "John",
      email: "john@example.com",
      interests: ["reading", "music"],
      contact: "email",
    });
  };

  return (
    <div>
      <button type="button" onClick={loadData} className="mb-4">
        Load data
      </button>

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
