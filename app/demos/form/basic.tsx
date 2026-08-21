"use client";

import { useRef } from "react";
import {
  Checkbox,
  Form,
  type FormRef,
  type FormValues,
  Input,
  Radio,
} from "@/ui";

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

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Field name="name" label="Name">
          {(field) => <Input {...field} placeholder="Enter your name" />}
        </Form.Field>

        <Form.Field name="email" label="Email">
          {(field) => (
            <Input {...field} type="email" placeholder="Enter your email" />
          )}
        </Form.Field>

        <Form.Fieldset
          name="interests"
          legend="Interests"
          description="Pick the ones you like"
        >
          {({ ...field }) => (
            <Checkbox.Group {...field}>
              <Checkbox value="reading">Reading</Checkbox>
              <Checkbox value="music">Music</Checkbox>
              <Checkbox value="sports">Sports</Checkbox>
            </Checkbox.Group>
          )}
        </Form.Fieldset>
        <Form.Fieldset
          type="single"
          name="contact"
          legend="Contact preference"
          description="How should we reach you?"
        >
          {({ ...field }) => (
            <Radio.Group {...field}>
              <Radio value="email">Email</Radio>
              <Radio value="phone">Phone</Radio>
              <Radio value="sms">SMS</Radio>
            </Radio.Group>
          )}
        </Form.Fieldset>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    </div>
  );
}
